import { Injectable, NotFoundException } from '@nestjs/common'
import { MovieService } from 'src/movie/movie.service'
import { PrismaService } from 'src/prisma.service'
import { GenreDto } from './dto/genre.dto'
import { ICollection } from './genre.interface'
import { returnGenreObject } from './return-genre.object'

@Injectable()
export class GenreService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly movieService: MovieService
	) {}

	async getBySlug(slug: string) {
		const genre = await this.prisma.genre.findUnique({
			where: { slug },
			select: {
				...returnGenreObject
			}
		})

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}

	async getAll(searchTerm?: string) {
		let options = {}
		
		if (searchTerm) {
			options = {
				where: {
					OR: [
						{
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						{
							description: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						{
							slug: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					]
				}
			}
		}

		return this.prisma.genre.findMany({
			...options,
			select: {
				...returnGenreObject
			}
		})
	}
	
	async getCollections() {
		const genres = await this.getAll()
		const collections = await Promise.all(
			genres.map(async genre => {
				const movieByGenre = await this.movieService.getByGenres([genre.id])

				const result: ICollection = {
					id: genre.id,
					image: movieByGenre[0].bigPoster,
					slug: genre.slug,
					name: genre.name
				}

				return result
			})
		)

		return collections
	}

	// Functions which need admin role to work
	
	async getById(id: string) {
		const genre = await this.prisma.genre.findUnique({
			where: { id },
			select: {
				...returnGenreObject
			}
		})

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}

	async create() {
		const defaultValue: GenreDto = {
			name: '',
			description: '',
			icon: '',
			slug: ''
		}

		return this.prisma.genre.create({
			data: defaultValue,
			select: {
				id: true
			}
		})
	}
	async update(id: string, dto: GenreDto) {
		const genre = await this.prisma.genre.update({
			where: { id },
			data: dto,
			select: {
				...returnGenreObject
			}
		})

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}

	async delete(id: string) {
		const genre = await this.prisma.genre.delete({
			where: { id },
			select: {
				...returnGenreObject
			}
		})

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}
}