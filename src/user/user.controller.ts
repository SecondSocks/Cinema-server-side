import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UseAuth } from 'src/auth/guards/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { UUIdValidationPipe } from './pipes/id.validation.pipe'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseAuth()
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.userService.getById(userId)
  }

  @UseAuth()
  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  async updateProfile(@CurrentUser('id') userId, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(userId, dto)
  }

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

  @Delete()
  @UseAuth()
  @HttpCode(200)
  async deleteProfile(@CurrentUser('id') id: string) {
    return this.userService.delete(id)
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

