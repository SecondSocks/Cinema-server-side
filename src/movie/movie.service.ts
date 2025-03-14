import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class MovieService {
	constructor(private readonly prisma: PrismaService) {}

	
}
