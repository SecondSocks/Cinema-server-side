import { Module } from '@nestjs/common'
import { MovieService } from 'src/movie/movie.service'
import { PrismaService } from 'src/prisma.service'
import { TelegramService } from 'src/telegram/telegram.service'
import { GenreController } from './genre.controller'
import { GenreService } from './genre.service'

@Module({
  controllers: [GenreController],
  providers: [GenreService, PrismaService, MovieService, TelegramService],
})
export class GenreModule {}
