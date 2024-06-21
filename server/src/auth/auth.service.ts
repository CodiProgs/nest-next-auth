import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'
import { Token, User } from '@prisma/client'
import { v4 } from 'uuid'
import { add } from 'date-fns'
import { convertTime } from 'src/common/utils'
import { LoginDto } from './dto/login.dto'
import { Response } from 'express'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private prisma: PrismaService,
		private config: ConfigService
	) {}

	async register(data: CreateUserDto) {
		return await this.userService.create(data)
	}

	async login(data: LoginDto) {
		const user = await this.userService.findByEmailOrId(data.email).catch(error => {
			throw new NotFoundException({extended: 'Email address is not registered'})
		})
		if (!user || !(await bcrypt.compare(data.password, user.password))) {
			throw new BadRequestException({extended: 'Wrong password'})
		}
		return user
	}

	async logout(refreshToken: string, res: Response){
		if (refreshToken) {
			await this.deleteRefreshToken(refreshToken)
			res.clearCookie('refreshToken')
		}
		return 'Logout successful'
	}

	async generateTokens(user: User, token: { ip: string; userAgent: string }) {
		const accessToken = this.jwtService.signAsync({
			sub: user.id,
			email: user.email,
			roles: user.roles
		})
		const refreshToken = await this.getRefreshToken(user.id, token)

		return { accessToken, refreshToken }
	}

	private async getRefreshToken(
		userId: string,
		token: { ip: string; userAgent: string }
	) {
		const newToken = v4()
		const expiresIn = add(new Date(), {
			days: convertTime(this.config.get('REFRESH_TOKEN_EXP', '30d'), 'd')
		})

		return this.prisma.token.upsert({
			where: {
				userId_ip_userAgent: {
					userId,
					ip: token.ip,
					userAgent: token.userAgent
				}
			},
			update: {
				token: newToken,
				exp: expiresIn
			},
			create: {
				token: newToken,
				exp: expiresIn,
				userId,
				ip: token.ip,
				userAgent: token.userAgent
			}
		})
	}

	async setRefreshTokenToCookie(refreshToken: Token, res: Response) {
		res.cookie('refreshToken', refreshToken.token, {
			httpOnly: true,
			sameSite: 'lax',
			secure:
				(await this.config.get('NODE_ENV', 'development')) === 'production',
			path: '/',
			expires: new Date(refreshToken.exp)
		})
	}

	async deleteRefreshToken(token: string) {
		return this.prisma.token.delete({
			where: {
				token
			}
		}).catch(error => {
			console.error(error)
		})
	}

	async refreshTokens(
		refreshToken: string,
		token: { ip: string; userAgent: string }
	) {
		const existingToken = await this.prisma.token.findUnique({
			where: {
				token: refreshToken
			}
		})
		if (!existingToken || new Date(existingToken.exp) < new Date()) {
			if(existingToken) await this.deleteRefreshToken(refreshToken)
			throw new BadRequestException({logout: 'Your session has expired. Log in again'})
		}
		const user = await this.userService.findByEmailOrId(existingToken.userId)
		if (!user) throw new NotFoundException({logout: 'Unexpected error. There seems to be something wrong with your account'})
		return await this.generateTokens(user, token)
	}
}
