import { Get, HttpCode, Param, Put, Req } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { BulkReadFileBo } from '../bo/bulk-read-file.bo';
import { ReadFileBo } from '../bo/read-file.bo';
import { RegisterFileBO } from '../bo/register-file.bo';
import { ArchiveFileDTO } from '../dto/archive-file.dto';
import { BulkReadFileDTO } from '../dto/bulk-read-file.dto';
import { ConfirmFileUploadedDTO } from '../dto/confirm-file-uploaded.dto';
import { RegisterFileDTO } from '../dto/register-file-dto';
import { ArchiveFileResult } from '../results/archive-file.result';
import { BulkReadSignedUrlResult } from '../results/bulk-read-signed-url.result';
import { ConfirmUploadResult } from '../results/confirm-upload.result';
import { ReadSignedUrlResult } from '../results/read-signed-url.result';
import { WriteSignedUrlResult } from '../results/write-signed-url.result';
import { FileService } from '../services/file.service';

@Controller({
  path: 'files',
  version: '1',
})
@ApiTags('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('uuid/:uuid')
  @ApiOperation({
    summary: 'File read url',
    description: 'Generates read signed url',
  })
  @ApiParam({
    name: 'uuid',
    example: '81713b3c17277dd1cf76ae0c9cef55d902083437',
  })
  @ApiOkResponse({
    description: 'Signed url',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  getReadUrl(
    @Param() params: any,
    @Req() request: Request,
  ): Promise<ReadSignedUrlResult> {
    const readFile = new ReadFileBo();
    readFile.uuid = params.uuid;
    readFile.ip = request.ip;
    readFile.userAgent = request.headers['user-agent'];
    readFile.userId = 1;
    return this.fileService.generateReadSignedUrl(readFile);
  }

  @HttpCode(200)
  @Post('bulk/uuid')
  @ApiOperation({
    summary: 'File read url bulk',
    description: 'Generates read signed url for array of uuids',
  })
  @ApiOkResponse({
    description: 'Signed url',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  getBulkReadUrl(
    @Body() dto: BulkReadFileDTO,
    @Req() request: Request,
  ): Promise<BulkReadSignedUrlResult> {
    const data = new BulkReadFileBo(dto);
    data.ip = request.ip;
    data.userAgent = request.headers['user-agent'];
    data.userId = 1;
    return this.fileService.bulkGenerateReadSignedUrl(data, 1);
  }

  @Post()
  @ApiOperation({
    summary: 'Upload url',
    description:
      'Registers the file request and returns a signed url to upload file',
  })
  @ApiCreatedResponse({
    description: 'File request registered',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  getUploadUrl(@Body() dto: RegisterFileDTO): Promise<WriteSignedUrlResult> {
    const registerFile = new RegisterFileBO(dto);
    registerFile.projectId = 1;
    return this.fileService.generateUploadSignedUrl(registerFile);
  }

  @ApiOperation({
    summary: 'Confirm file uploaded',
    description: 'Confirm the file uploaded in the signed url',
  })
  @ApiCreatedResponse({
    description: 'File marked as uploaded',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @Put('confirm')
  confirm(@Body() dto: ConfirmFileUploadedDTO): Promise<ConfirmUploadResult> {
    return this.fileService.confirmUpload(dto.uuid);
  }

  @ApiOperation({
    summary: 'Archive uploaded file',
    description: 'Archive the uploaded file',
  })
  @ApiCreatedResponse({
    description: 'File archived',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @Put('archive')
  archive(@Body() dto: ArchiveFileDTO): Promise<ArchiveFileResult> {
    return this.fileService.archiveDirectory(dto.uuid);
  }
}
