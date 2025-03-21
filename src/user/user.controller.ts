import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UseAuth } from 'src/auth/guards/auth.guard'
import { UUIdValidationPipe } from '../utils/pipes/id.validation.pipe'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseAuth()
  @Get('profile')
  async getProfile(@CurrentUser('id', UUIdValidationPipe) userId: string) {
    return this.userService.getById(userId)
  }

  @UseAuth()
  @Get('favorites')
  async getFavorites(@CurrentUser('id', UUIdValidationPipe) userId: string) {
    return this.userService.getFavorites(userId)
  }

  @UseAuth()
  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  async updateProfile(@CurrentUser('id', UUIdValidationPipe) userId, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(userId, dto)
  }

  @UseAuth()
  @Patch('toggle-favorite')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async toggleFavorite(
    @CurrentUser('id', UUIdValidationPipe) userId: string,
    @Body('movieId', UUIdValidationPipe) movieId: string
  ) {
    return this.userService.toggleFavorite(userId, movieId)
  }

  @Delete()
  @UseAuth()
  @HttpCode(200)
  async deleteProfile(@CurrentUser('id', UUIdValidationPipe) id: string) {
    return this.userService.delete(id)
  }

  // For admin
  @UseAuth('admin')
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  async updateUser(@Param('id', UUIdValidationPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(id, dto)
  }

  @UseAuth('admin')
  @Get('count')
  @HttpCode(200)
  async countUsers() {
    return this.userService.countUsers()
  }

  @UseAuth('admin')
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  @HttpCode(200)
  async deleteUser(@Param('id', UUIdValidationPipe) id: string) {
    return this.userService.delete(id)
  }

  @UseAuth('admin')
  @Get()
  @HttpCode(200)
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAllUsers(searchTerm)
  }

  @UseAuth('admin')
  @Get(':id')
  @HttpCode(200)
  async getUserProfile(@Param('id', UUIdValidationPipe) id: string) {
    return this.userService.getById(id)
  }
}

