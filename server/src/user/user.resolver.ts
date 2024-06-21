import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'
import { UserType } from './type/user.type'
import { NotFoundException, UseGuards } from '@nestjs/common'
import { RolesGuard } from 'src/auth/guards'
import { CurrentUser, Public, Roles } from 'src/common/decorators'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtPayload } from 'src/auth/interfaces'
import { GraphQLUpload } from 'graphql-upload-ts'
import { FileService } from 'src/file/file.service'

@Resolver()
export class UserResolver {
	constructor(
		private readonly userService: UserService,
		private readonly fileService: FileService
	) {}

	@Query(() => UserType)
	async getUserProfile(@Args('nickname') nickname: string) {
		return this.userService.findByNickname(nickname)
	}

	@Mutation(() => String)
	async deleteUser(@Args('id') id: string, @CurrentUser() user: JwtPayload) {
		return this.userService.delete(id, user)
	}

	@Mutation(() => String)
	async updateUser(
		@CurrentUser('id') id: string,
		@Args('updateUserInput') dto: UpdateUserDto,
	) {
		return this.userService.update(id, dto)
	}

	@Mutation(() => String)
	async updateUserAvatar(
		@Args({ name: 'image', type: () => GraphQLUpload }) image: any,
		@CurrentUser('id') id: string
	) {
		const imagePath = await this.fileService.saveFile(image, 'avatars')
		await this.userService.updateUserAvatar(id, imagePath)
		return imagePath
	}

	//test the role guard
	@UseGuards(RolesGuard)
	@Roles('ADMIN')
	@Query(() => String)
	async admin() {
		return 'admin'
	}
}
