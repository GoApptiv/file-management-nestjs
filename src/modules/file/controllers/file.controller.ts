import { Body, Controller, Post } from '@nestjs/common';
import { RegisterFileDto } from '../dto/register-file-dto';
import { FileService } from '../services/file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  getUploadUrl(@Body() dto: RegisterFileDto): Promise<string> {
    return this.fileService.getUploadSignedUrl(dto);
  }
}
