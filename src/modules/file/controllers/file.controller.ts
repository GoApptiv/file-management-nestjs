import { Get, Param, Put, Req } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { Request } from 'express';
import { ReadFileBo } from '../bo/read-file.bo';
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
  getSignedUrl(
    @Param() params: any,
    @Req() request: Request,
  ): Promise<ReadSignedUrlResult> {
    const readFile = new ReadFileBo();
    readFile.uuid = params.uuid;
    readFile.ip = request.ip;
    readFile.userAgent = request.headers['user-agent'];
    readFile.userId = 1;
    return this.fileService.getReadSignedUrl(readFile);
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
