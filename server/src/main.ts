import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as CookieParser from 'cookie-parser'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { graphqlUploadExpress } from 'graphql-upload-ts'
import { GraphQLErrorFilter } from './common/filters'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({
		origin: 'http://localhost:3000',
		credentials: true,
		allowedHeaders: [
			'Accept',
			'Authorization',
			'Content-Type',
			'X-Requested-With',
			'apollo-require-preflight',
			'set-cookie'
		],
		methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
	})
	app.use(CookieParser())
	app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 1 }))
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			exceptionFactory: errors => {
				const formattedErrors = errors.reduce((acc, err) => {
					acc[err.property] = Object.values(err.constraints).join(', ')
					return acc
				}, {})
				throw new BadRequestException(formattedErrors)
			}
		})
	)
	app.useGlobalFilters(new GraphQLErrorFilter())
	await app.listen(process.env.PORT || 4200)
}
bootstrap()
