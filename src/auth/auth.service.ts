import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService
	) {}

	async register(dto: AuthDto) {
		const oldUser = await this.prismaService.user.findUnique({
			where: { email: dto.email }
		})

		if (oldUser) throw new BadRequestException('User with this email already exists')

		return this.userService.create(dto)
	}
}
