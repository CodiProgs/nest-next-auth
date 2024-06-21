import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtPayload } from '../interfaces'
import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private config: ConfigService,
		private userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: config.get('JWT_SECRET')
		})
	}

	async validate(payload: JwtPayload) {
		const user = await this.userService.findByEmailOrId(payload.email).catch(error => {
			throw new UnauthorizedException('User not found')
		})
		return user
	}
}
