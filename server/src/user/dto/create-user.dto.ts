import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator'
import { IsPasswordsMatching } from 'src/common/decorators'

@InputType()
export class CreateUserDto {
	@Field()
	@IsNotEmpty({ message: 'Name is required' })
	@IsString({ message: 'Name should be a string' })
	@MinLength(3, { message: 'Name should be at least 3 characters' })
	@MaxLength(20, { message: 'Name should be at most 20 characters' })
	name: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString({ message: 'Surname should be a string' })
	@MinLength(3, { message: 'Surname should be at least 3 characters' })
	@MaxLength(20, { message: 'Surname should be at most 20 characters' })
	surname?: string

	@Field()
	@IsNotEmpty({ message: 'Email is required' })
	@IsEmail({}, { message: 'Invalid email' })
	email: string

	@Field()
	@IsNotEmpty({ message: 'Password is required' })
	@IsString({ message: 'Password should be a string' })
	@MinLength(6, { message: 'Password should be at least 6 characters' })
	@MaxLength(32, { message: 'Password should be at most 32 characters' })
	password: string

	@Field()
	@IsNotEmpty({ message: 'Password confirmation is required' })
	@IsPasswordsMatching('password', { message: 'Passwords do not match' })
	passwordConfirm: string
}
