import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { UseAuth } from 'src/auth/guards/auth.guard'
import { UUIdValidationPipe } from 'src/utils/pipes/id.validation.pipe'
import { GenreDto } from './dto/genre.dto'
import { GenreService } from './genre.service'

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  // For all users
  @Get('by-slug/:slug')
  @HttpCode(200)
  async getBySlug(@Param('slug') slug: string) {
    return this.genreService.getBySlug(slug)
  }

  @Get()
  @HttpCode(200)
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.getAll(searchTerm)
  }

  @Get('collections')
  @HttpCode(200)
  async getCollections() {
    return this.genreService.getCollections()
  }

  // For admin
  @Get(':id')
  @UsePipes(new ValidationPipe())
  @UseAuth('admin')
  @HttpCode(200)
  async getById(@Param('id', UUIdValidationPipe) id: string) {
    return this.genreService.getById(id)
  }

  @Post()
  @UseAuth('admin')
  @HttpCode(200)
  async create() {
    return this.genreService.create()
  }

  @Put(':id')
  @UseAuth('admin')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async update(@Param('id', UUIdValidationPipe) id: string, @Body() dto: GenreDto) {
    return this.genreService.update(id, dto)
  }

  @Delete(':id')
  @UseAuth('admin')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async delete(@Param('id', UUIdValidationPipe) id: string) {
    return this.genreService.delete(id)
  }
}
