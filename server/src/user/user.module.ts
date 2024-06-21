import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { CacheModule } from '@nestjs/cache-manager'
import { FileModule } from 'src/file/file.module'

@Module({
	imports: [CacheModule.register(), FileModule],
	providers: [UserService, UserResolver],
	exports: [UserService]
})
export class UserModule {}
