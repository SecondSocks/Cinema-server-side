import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { returnUserObject, returnUserObjectForAdmin } from './return-user.object'

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: AuthDto) {
		return this.prismaService.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				name: 'No name'
			}
		})
	}

	async getById(userId: string) {
		return this.prismaService.user.findUnique({
			where: {
				id: userId
			},
			select: {
				...returnUserObject,
				favorites: {
					select: {
						id: true,
						name: true,
						createdAt: true,
						updatedAt: true
					}
				}
			},
		})
	}

	async getByEmail(email: string) {
		return this.prismaService.user.findUnique({
			where: {
				email
			},
			select: {
				...returnUserObject,
				password: true,
				favorites: {
					select: {
						id: true,
						name: true,
						createdAt: true,
						updatedAt: true
					}
				}
			},
		})
	}

	async updateProfile(id: string, dto: UpdateUserDto) {
		const user = await this.getById(id)
		 
		if (!user) throw new BadRequestException('User not found')

		const isSameUser = await this.prismaService.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (isSameUser && id !== isSameUser.id) throw new NotFoundException('Email busy')

		return this.prismaService.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				password: dto.password ? await hash(dto.password) : user.password,
				name: dto.name ? dto.name : user.name,
				isAdmin: dto.isAdmin ? dto.isAdmin : user.isAdmin
			}
		})
	}
	
	async delete(id: string) {
		return this.prismaService.user.delete({
			where: {
				id
			}
		})
	}
	
	// For admin
	async countUsers() {
		return this.prismaService.user.count()	
	}

	async getAllUsers(searchTerm?: string) {
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
							email: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					]
				}
			}
		}

		return this.prismaService.user.findMany({
			...options,
			select: {
				...returnUserObjectForAdmin
			},
			orderBy: {
				createdAt: 'desc'
			}
		})
	}

}
