import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { MovieDto } from './dto/movie.dto'

@Injectable()
export class MovieService {
	constructor(private readonly prisma: PrismaService) {}

	async getBySlug(slug: string) {
		const movie = await this.prisma.movie.findUnique({
			where: { slug },
			select: {
				actors: true,
				genres: true
			}
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
				actors: true,
				genres: true
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
			}
		})

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}

	// Admin
	async getById(id: string) {
		const movie = await this.prisma.movie.findUnique({
			where: { id },
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
			}
		})

		return {
			id: movie.id
		}
	}

	async update(id: string, dto: MovieDto) {
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

		return movie
	}
}
