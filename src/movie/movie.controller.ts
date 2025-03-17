import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { UseAuth } from 'src/auth/guards/auth.guard'
import { MovieDto } from './dto/movie.dto'
import { MovieService } from './movie.service'

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  @HttpCode(200)
  async getBySlug(@Param('slug') slug: string) {
    return this.movieService.getBySlug(slug)
  }

  @Get()
  @HttpCode(200)
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.getAll(searchTerm)
  }

  @Get('by-actor/:actorId')
  @HttpCode(200)
  async getByActor(@Param('actorId') actorId: string) {
    return this.movieService.getByActor(actorId)
  }

  @Get('by-genres/:genreIds')
  @HttpCode(200)
  async getByGenres(@Param('genreIds') genreIds: string[]) {
    return this.movieService.getByGenres(genreIds)
  }

  @Get('popular')
  @HttpCode(200)
  async getMostPopular() {
    return this.movieService.getMostPopular()
  }

  @Patch('update-count-opened/:slug')
  @HttpCode(200)
  async updateCountOpened(slug: string) {
    return this.movieService.updatedCountOpened(slug)
  }

  // Admin
  @Get(':id')
  @UseAuth('admin')
  @HttpCode(200)
  async getById(@Param('id') id: string) {
    return this.movieService.getById(id)
  }

  @Post()
  @UseAuth('admin')
  @HttpCode(200)
  async create() {
    return this.movieService.create()
  }

  @Put(':id')
  @UseAuth('admin')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() dto: MovieDto) {
    return this.movieService.update(id, dto)
  }

  @Delete(':id')
  @UseAuth('admin')
  @HttpCode(200)
  async delete(@Param('id') id: string) {
    return this.movieService.delete(id)
  }
}
