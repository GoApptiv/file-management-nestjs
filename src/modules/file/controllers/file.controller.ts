import { Get, Param, Put } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { RegisterFileBO } from '../bo/register-file.bo';
import { ConfirmFileUploadedDTO } from '../dto/confirm-file-uploaded.dto';
import { RegisterFileDTO } from '../dto/register-file-dto';
import { ConfirmUploadResult } from '../results/confirm-upload.result';
import { ReadSignedUrlResult } from '../results/read-signed-url.result';
import { WriteSignedUrlResult } from '../results/write-signed-url.result';
import { FileService } from '../services/file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('uuid/:uuid')
  getSignedUrl(@Param() params: any): Promise<ReadSignedUrlResult> {
    return this.fileService.getReadSignedUrl(params.uuid);
  }

  @Post()
  getUploadUrl(@Body() dto: RegisterFileDTO): Promise<WriteSignedUrlResult> {
    const registerFile = new RegisterFileBO(dto);
    registerFile.projectId = 1;
    return this.fileService.getUploadSignedUrl(registerFile);
  }

  @Put('confirm')
  confirm(@Body() dto: ConfirmFileUploadedDTO): Promise<ConfirmUploadResult> {
    return this.fileService.confirmUpload(dto.uuid);
  }
}
