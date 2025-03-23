import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UseAuth } from 'src/auth/guards/auth.guard'
import { RatingDto } from './dto/rating.dto'
import { RatingService } from './rating.service'

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  @UseAuth()
  @HttpCode(200)
  async getMovieValueByUser(@Param('movieId') movieId: string, @CurrentUser('id') userId: string) {
    return this.ratingService.getMovieValueByUser(movieId, userId)
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @HttpCode(200)
  @UseAuth()
  async setRating(@CurrentUser('id') userId: string, @Body() dto: RatingDto) {
    return this.ratingService.setRating(userId, dto)
  }
}
