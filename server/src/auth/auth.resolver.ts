import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { UserType } from 'src/user/type/user.type'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { Cookie, IpAddress, Public, UserAgent } from 'src/common/decorators'
import { Response } from 'express'
import { LoginDto } from './dto/login.dto'
import { UnauthorizedException } from '@nestjs/common'

@Resolver()
@Public()
export class AuthResolver {
	constructor(private authService: AuthService) {}

	@Mutation(() => UserType)
	async register(
		@Args('registerInput') dto: CreateUserDto,
		@Context() context: { res: Response },
		@UserAgent() userAgent: string,
		@IpAddress() ip: string
	) {
		const user = await this.authService.register(dto)
		const tokens = await this.authService.generateTokens(user, {
			ip,
			userAgent
		})

		await this.authService.setRefreshTokenToCookie(
			tokens.refreshToken,
			context.res
		)
		return {
			...user,
			token: tokens.accessToken
		}
	}

	@Mutation(() => UserType)
	async login(
		@Args('loginInput') dto: LoginDto,
		@Context() context: { res: Response },
		@UserAgent() userAgent: string,
		@IpAddress() ip: string
	) {
		const user = await this.authService.login(dto)
		const tokens = await this.authService.generateTokens(user, {
			ip,
			userAgent
		})

		await this.authService.setRefreshTokenToCookie(
			tokens.refreshToken,
			context.res
		)
		return {
			...user,
			token: tokens.accessToken
		}
	}

	@Mutation(() => String)
	async logout(
		@Cookie('refreshToken') refreshToken: string,
		@Context() context: { res: Response }
	) {
		return await this.authService.logout(refreshToken, context.res)
	}

	@Mutation(() => String)
	async refreshTokens(
		@Cookie('refreshToken') refreshToken: string,
		@Context() context: { res: Response },
		@IpAddress() ip: string,
		@UserAgent() userAgent: string
	) {
		if (!refreshToken) throw new UnauthorizedException({logout: 'Your session has expired. Log in again'})
		const tokens = await this.authService.refreshTokens(refreshToken, {
			ip,
			userAgent
		})

		await this.authService.setRefreshTokenToCookie(
			tokens.refreshToken,
			context.res
		)
		return tokens.accessToken
	}
}
