import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { GenreDto } from './dto/genre.dto'
import { returnGenreObject } from './return-genre.object'

@Injectable()
export class GenreService {
	constructor(private readonly prisma: PrismaService) {}

	async getBySlug(slug: string) {
		return this.prisma.genre.findUnique({
			where: { slug },
			select: {
				...returnGenreObject
			}
		})
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
	
	//TODO: will work on this later
	async getCollections() {
		const genres = await this.getAll()
		const collections = genres

		return collections
	}

	// Functions which need admin role to work
	
	async getById(id: string) {
		return this.prisma.genre.findUnique({
			where: { id },
			select: {
				...returnGenreObject
			}
		})
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
		return this.prisma.genre.update({
			where: { id },
			data: dto,
			select: {
				...returnGenreObject
			}
		})
	}

	async delete(id: string) {
		return this.prisma.genre.delete({
			where: { id },
			select: {
				...returnGenreObject
			}
		})
	}
}
