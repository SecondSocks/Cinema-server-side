import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TelegramService } from 'src/telegram/telegram.service'
import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'

@Module({
  controllers: [MovieController],
  providers: [MovieService, PrismaService, TelegramService],
  exports: [MovieService],
})
export class MovieModule {}
