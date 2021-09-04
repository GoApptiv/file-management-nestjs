import { Controller, Get } from '@nestjs/common';
import { FileService } from '../service/file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  getHello(): string {
    return this.fileService.getHello();
  }
}
