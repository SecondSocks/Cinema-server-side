import { Injectable } from '@nestjs/common'
import { MovieService } from 'src/movie/movie.service'
import { PrismaService } from 'src/prisma.service'
import { RatingDto } from './dto/rating.dto'
@Injectable()
export class RatingService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly movieService: MovieService
	) {}

	async getMovieValueByUser(movieId: string, userId: string) {
		const data = await this.prisma.rating.findUnique({
			where: {
				userId_movieId: {
					userId: userId,
					movieId: movieId
				}
			}
		})

		return data ? data.value : 0
	}

	private async averageRatingByMovie(movieId: string) {
		const avgRating = await this.prisma.rating.aggregate({
			where: {
				movieId
			},
			_avg: {
				value: true
			}
		})

		return avgRating._avg.value
	}

	async setRating(userId: string, dto: RatingDto) {
		const {movieId, value} = dto

		const newRating = await this.prisma.rating.upsert({
			where: {
				userId_movieId: {
					userId: userId,
					movieId: movieId
				}
			},
			update: {
				value
			},
			create: {
				movieId: movieId,
				userId: userId,
				value
			},
		})

		const averageRating = await this.averageRatingByMovie(movieId)

		await this.movieService.updateRating(movieId, averageRating)

		return newRating
	}
}
