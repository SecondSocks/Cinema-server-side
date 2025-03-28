import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TelegramService } from 'src/telegram/telegram.service'
import { MovieDto } from './dto/movie.dto'
import { returnMovieObject } from './return-movie.object'

@Injectable()
export class MovieService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly telegramService: TelegramService
	) {}

	async getBySlug(slug: string) {
		const movie = await this.prisma.movie.findUnique({
			where: { slug },
			select: {
				...returnMovieObject
			},
			
		})

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}

	async getAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				where: {
					OR: [
						{
							title: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					]
				}
			}
		}

		return this.prisma.movie.findMany({
			...options,
			select: {
				...returnMovieObject
			}
		})
	}

	async getByActor(actorId: string) {
		const movies = await this.prisma.movie.findMany({
			where: {
				actors: {
					some: {
						id: actorId
					}
				}
			},
			select: {
				...returnMovieObject
			}
		})

		if (!movies) throw new NotFoundException('Movies not found')

		return movies
	}

	async getByGenres(genreIds: string[]) {
		const movies = await this.prisma.movie.findMany({
			where: {
				genres: {
					some: {
						id: {
							in: genreIds
						}
					}
				}
			},
			select: {
				...returnMovieObject
			}
		})
		
		if (!movies) throw new NotFoundException('Movies not found')
			
		return movies
	}

		async getMostPopular() {
			return this.prisma.movie.findMany({
				where: {
					countOpened: {
						gt: 0
					}
				},
				orderBy: {
					countOpened: 'desc'
				},
				select: {
					...returnMovieObject
				}
			})
		}
		
	async updatedCountOpened(slug: string) {
		const movie = await this.prisma.movie.update({
			where: { slug },
			data: {
				countOpened: {
					increment: 1
				}
			},
			select: {
				id: true,
				title: true,
				countOpened: true
			}
		})

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}

	async updateRating(movieId: string, rating: number) {
		return this.prisma.movie.update({
			where: {
				id: movieId
			},
			data: {
				rating
			}
		})
	}

	// Admin
	async getById(id: string) {
		const movie = await this.prisma.movie.findUnique({
			where: { id },
			select: {
				...returnMovieObject
			}
		})

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}


	async create() {
		const movie = await this.prisma.movie.create({
			data: {
				title: '',
				description: '',
				poster: '',
				bigPoster: '',
				slug: '',
				videoUrl: '',
				genres: { connect: [] },
				actors: { connect: [] },
			},
			select: {
				...returnMovieObject
			}
		})

		return {
			id: movie.id
		}
	}

	async update(id: string, dto: MovieDto) {
		if (!dto.isSendTelegram) {
			await this.sendNotification(dto)
			dto.isSendTelegram = true
		}

		const { parameters, genres, actors, ...rest } = dto

		const movie = await this.prisma.movie.update({
			where: { id },
			data: {
				...rest,
				parameters: parameters ? {
					create: parameters.create
				} : undefined,
				genres: {
					connect: genres.map(id => ({ id }))
				},
				actors: {
					connect: actors.map(id => ({ id }))
				}
			},
			select: {
				...returnMovieObject
			}
		})

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}

	async delete(id: string) {
		const movie = await this.prisma.movie.delete({
			where: { id }
		})

		if (!movie) throw new NotFoundException('Movie not found')

		return {
			message: `${id} has been deleted`
		}
	}

	async sendNotification(dto: MovieDto) {
		// if (process.env.NODE_ENV !== 'development')
			// await this.telegramService.sendPhoto(dto.poster)
		await this.telegramService.sendPhoto('https://pikuco.ru/upload/test_stable/947/9470830c7be753c0d39bc7949047315f.webp')

		const text = `<b>${dto.title}</b>`

		await this.telegramService.sendMessage(text, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							url: 'https://lord-serial2025.top/55-tob.html',
							text: 'Go to watch'
						}
					]
				]
			}
		})
	}
}