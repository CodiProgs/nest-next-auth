import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { GUARDS } from './guards'
import { JwtStrategy } from './strategies'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtOptions } from 'src/common/config'

@Module({
	providers: [AuthService, AuthResolver, ...GUARDS, JwtStrategy],
	imports: [UserModule, JwtModule.registerAsync(JwtOptions())]
})
export class AuthModule {}
