import { Injectable } from '@nestjs/common'
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
				name: 'John Doe'
			}
		})
	}
}
