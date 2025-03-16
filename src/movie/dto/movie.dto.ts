import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator'

export class Parameters {
	@IsNumber()
	year: number
	
	@IsNumber()
	duration: number
	
	@IsString()
	country: string
}

export class MovieDto {
	@IsString()
	poster: string

	@IsString()
	bigPoster: string

	@IsString()
	title: string
	
	@IsString()
	description: string

	@IsNumber()
	rating?: number

	@IsNumber()
	countOpened?: number
	
	@IsString()
	slug: string
	
	@IsString()
	videoUrl: string
	
	@IsArray()
	genres: string[]
	
	@IsArray()
	actors: string[]

	@IsBoolean()
	isSendTelegram?: boolean
	
	@IsObject()
	parameters?: {
		create: Parameters
	}
}