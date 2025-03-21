import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ActorDto } from './dto/actor.dto'

@Injectable()
export class ActorService {
	constructor(private readonly prisma: PrismaService) {}

	async getBySlug(slug: string) {
		const actor = await this.prisma.actor.findUnique({
			where: { slug }
		})

		if (!actor) throw new NotFoundException('Actor not found')

		return actor
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
								slug: {
									contains: searchTerm,
									mode: 'insensitive'
								}
							}
						]
					}
				}
			}
	

			return this.prisma.actor.findMany({
				...options,
				select: {
					id: true,
					name: true,
					slug: true,
					photo: true,
					_count: {
							select: {
									movies: true
							}
					}
			},
				orderBy: {
					createdAt: 'desc'
				},
				
			})
		}

		// Admin
		async getById(id: string) {
			const actor = await this.prisma.actor.findUnique({
				where: { id }
			})

			if (!actor) throw new NotFoundException('Actor not found')

			return actor
		}

		async create() {
			const defaultValue: ActorDto = {
				name: '',
				slug: '',
				photo: ''
			}

			const actor = await this.prisma.actor.create({
				data: defaultValue
			})

			return { id: actor.id }
		}

		async update(id: string, dto: ActorDto) {
			const actor = await this.prisma.actor.update({
				where: { id },
				data: dto
			})

			if (!actor) throw new NotFoundException('Actor not found')

			return actor
		}

		async delete(id: string) {
			const actor = await this.prisma.actor.delete({
				where: { id }
			})

			if (!actor) throw new NotFoundException('Actor not found')

			return actor
		}

}
