import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { UseAuth } from 'src/auth/guards/auth.guard'
import { UUIdValidationPipe } from 'src/utils/pipes/id.validation.pipe'
import { ActorService } from './actor.service'
import { ActorDto } from './dto/actor.dto'

@Controller('actor')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('by-slug/:slug')
  @HttpCode(200)
  async getBySlug(@Param('slug') slug: string) {
    return this.actorService.getBySlug(slug)
  }

  @Get()
  @HttpCode(200)
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.actorService.getAll(searchTerm)
  }

  // Admin
  @Get(':id')
  @UseAuth('admin')
  @HttpCode(200)
  async getById(@Param('id', UUIdValidationPipe) id: string) {
    return this.actorService.getById(id)
  }

  @Post()
  @UseAuth('admin')
  @HttpCode(200)
  async create() {
    return this.actorService.create()
  }

  @Put(':id')
  @UseAuth('admin')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async update(@Param('id', UUIdValidationPipe) id: string, @Body() dto: ActorDto) {
    return this.actorService.update(id, dto)
  }
  
  @Delete(':id')
  @UseAuth('admin')
  @HttpCode(200)
  async delete(@Param('id', UUIdValidationPipe) id: string) {
    return this.actorService.delete(id)
  }
}
