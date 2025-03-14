import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UseAuth } from 'src/auth/guards/auth.guard'
import { FileService } from './file.service'

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseAuth('admin')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFiles(@UploadedFile() files: Express.Multer.File[], @Query('folder') folder?: string) {
    return this.fileService.saveFiles(files, folder)
  }
}
