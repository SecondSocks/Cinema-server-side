import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async register(dto: AuthDto) {
		if (dto.email === '' || dto.password === '') throw new BadRequestException('Request must contain email and password')

		const oldUser = await this.prismaService.user.findUnique({
			where: { email: dto.email }
		})

		if (oldUser) throw new BadRequestException('User with this email already exists')

		const user = await this.userService.create(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken
		}
	}

	async login(dto: AuthDto) {
		if (dto.email === '' || dto.password === '') throw new BadRequestException('Data is null')

		const user = await this.validateUser(dto)
		const tokens = await this.issueTokens(user.id)

		return {
			user,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken
		}
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwtService.verifyAsync(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid token')

		const user = await this.userService.getById(result.id)
		const tokens = await this.issueTokens(user.id)

		return {
			user,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken
		}
	}

	private async issueTokens(userId: string) {
		const data = {
			id: userId
		}

		const accessToken = this.jwtService.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwtService.sign(data, {
			expiresIn: '7d'
		})

		return {
			accessToken,
			refreshToken
		}
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new BadRequestException('User with this email does not exist')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}
}
