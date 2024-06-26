import { ConfigService } from '@nestjs/config'
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt'

const jwtModuleOption = (config: ConfigService): JwtModuleOptions => ({
	secret: config.get('JWT_SECRET'),
	signOptions: { expiresIn: config.get('JWT_EXP', '5m') }
})

export const JwtOptions = (): JwtModuleAsyncOptions => ({
	inject: [ConfigService],
	useFactory: (config: ConfigService) => jwtModuleOption(config)
})
