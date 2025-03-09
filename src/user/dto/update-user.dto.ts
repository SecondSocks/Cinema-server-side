import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	@MinLength(6, {
		message: 'Password must be at least 6 characters'
	})
	password?: string

	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsBoolean()
	isAdmin?: boolean
}