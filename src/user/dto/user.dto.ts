import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsString()
	email: string

	@IsString()
	@MinLength(6, {
		message: 'Password must be at least 6 characters'
	})
	password: string

	@IsBoolean()
	@IsOptional()
	isAdmin?: boolean
}