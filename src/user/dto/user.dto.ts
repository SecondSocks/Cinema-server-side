import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UserDto {
	@IsString()
	name: string

	@IsString()
	email: string

	@IsString()
	password: string

	@IsBoolean()
	@IsOptional()
	isAdmin?: boolean
}