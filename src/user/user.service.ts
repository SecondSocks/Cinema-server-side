import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { hash } from 'argon2'
import { AuthDto } from 'src/auth/dto/auth.dto'
import { PrismaService } from 'src/prisma.service'

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

	async returnUserField(user: User) {
		return {
			id: user.id,
			email: user.email
		}
	}

	async getById(userId: string) {
		return this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})
	}

	async getByEmail(email: string) {
		return this.prismaService.user.findUnique({
			where: {
				email
			}
		})
	}
}
