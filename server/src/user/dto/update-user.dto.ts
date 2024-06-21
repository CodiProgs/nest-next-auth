import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class UpdateUserDto {
	@Field()
	@IsNotEmpty({ message: 'Name should not be empty' })
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
}
