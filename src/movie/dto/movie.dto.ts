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
	@IsString({
		each: true
	})
	genres: string[]
	
	@IsArray()
	@IsString({
		each: true
	})
	actors: string[]

	@IsBoolean()
	isSendTelegram?: boolean
	
	@IsObject()
	parameters?: Parameters

}