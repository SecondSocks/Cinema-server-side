import { IsNumber, IsUUID } from 'class-validator'

export class RatingDto {
	@IsUUID()
	movieId: string

	@IsNumber()
	value: number
}