import { Module } from '@nestjs/common'
import { MovieService } from 'src/movie/movie.service'
import { PrismaService } from 'src/prisma.service'
import { RatingController } from './rating.controller'
import { RatingService } from './rating.service'

@Module({
  controllers: [RatingController],
  providers: [RatingService, PrismaService, MovieService],
})
export class RatingModule {}
