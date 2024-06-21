import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
	ConflictException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Provider, Role, User } from '@prisma/client'
import { Cache } from 'cache-manager'
import { PrismaService } from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import { convertTime } from 'src/common/utils'
import { CreateUserDto } from './dto/create-user.dto'
import { FileService } from 'src/file/file.service'
import { JwtPayload } from 'src/auth/interfaces'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly config: ConfigService,
		private readonly fileService: FileService
	) {}

	async findByNickname(nickname: string) {
		const cachedUser = await this.cacheManager.get(nickname)
		if (cachedUser) {
			return cachedUser
		}
		const dbUser = await this.prisma.user.findUnique({
			where: {
				nickname
			}
		})
		if (!dbUser) throw new NotFoundException('User not found')
		await this.updateUserInCache(dbUser)
		return dbUser
	}

	async findByEmailOrId(emailOrId: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				OR: [
					{
						email: emailOrId
					},
					{
						id: emailOrId
					}
				]
			}
		})
		if (!user) throw new NotFoundException('User not found')
		return user
	}

	async create(data: CreateUserDto, provider: Provider = 'LOCAL') {
		const hashedPassword = data.password
			? await bcrypt.hash(data.password, 10)
			: null
		const id = v4()

		return await this.prisma.user
			.create({
				data: {
					id,
					password: hashedPassword,
					nickname: id,
					provider,
					roles: ['USER'],
					email: data.email,
					name: data.name,
					surname: data.surname
				}
			})
			.catch(err => {
				if (err.code === 'P2002') {
					throw new ConflictException({extended: 'Email already exists'})
				}
				throw err
			})
	}

	async delete(id: string, user: JwtPayload) {
		if (user.sub !== id && !user.roles.includes(Role.ADMIN)) {
			throw new ForbiddenException('You are not allowed to delete this user')
		}

		const deletedUser = await this.findByEmailOrId(id)
		if (!deletedUser) {
			throw new NotFoundException('User not found')
		}

		await this.prisma.$transaction(async prisma => [
			await prisma.user.delete({ where: { id } }),
			await this.fileService.deleteFile(deletedUser.avatar),
			await this.cacheManager.del(`user:${deletedUser.nickname}`)
		])

		return id
	}

	async update(id: string, dto: UpdateUserDto) {
		const user = await this.findByEmailOrId(id).catch(error => {
			throw new NotFoundException({logout: 'Unexpected error. There seems to be something wrong with your account'})
		})

		await this.prisma.$transaction(async prisma => [
			await prisma.user.update({
				where: { id },
				data: { ...dto }
			}),
			await this.updateUserInCache({ ...user, ...dto })
		])

		return 'Your data updated successfully'
	}

	async updateUserAvatar(id: string, imagePath: string) {
		const user = await this.findByEmailOrId(id)
		if (!user) {
			throw new NotFoundException({logout: 'Unexpected error. There seems to be something wrong with your account'})
		}
		await this.prisma.$transaction(async prisma => [
			await prisma.user.update({
				where: { id },
				data: {
					avatar: imagePath
				}
			}),
			await this.fileService.deleteFile(user.avatar),
			await this.updateUserInCache({ ...user, avatar: imagePath })
		])
		return 'Your avatar updated successfully'
	}

	async updateUserInCache(user: User) {
		await this.cacheManager.set(
			user.nickname,
			user,
			convertTime(this.config.get('JWT_EXP'), 's')
		)
	}
}
