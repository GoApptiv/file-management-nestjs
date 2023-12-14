import {
  Get,
  HttpCode,
  Param,
  Put,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { BulkReadFileBO } from '../../bo/bulk-read-file.bo';
import { ReadFileBO } from '../../bo/read-file.bo';
import { RegisterFileBO } from '../../bo/register-file.bo';
import { BulkReadFileDTO } from '../../dto/bulk-read-file.dto';
import { ConfirmFileUploadedDTO } from '../../dto/confirm-file-uploaded.dto';
import { RegisterFileDTO } from '../../dto/register-file-dto';
import { BulkReadSignedUrlResult } from '../../results/bulk-read-signed-url.result';
import { ConfirmUploadResult } from '../../results/confirm-upload.result';
import { ReadSignedUrlResult } from '../../results/read-signed-url.result';
import { WriteSignedUrlResult } from '../../results/write-signed-url.result';
import { FileService } from '../../services/file.service';

@Controller({
  path: 'files',
  version: '1',
})
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * Generates a signed url for reading a file.
   */
  @Get('uuid/:uuid')
  @UseGuards(JwtAuthGuard)
  getReadUrl(
    @Param('uuid') uuid: string,
    @Req() request: Request,
    @RealIP() ip: string,
  ): Promise<ReadSignedUrlResult> {
    const readFile: ReadFileBO = {
      uuid,
      ip,
      userAgent: request.headers['user-agent'],
    };
    return this.fileService.generateReadSignedUrl(
      readFile,
      request['user'].projectId,
      request['user'].isAdmin,
    );
  }

  /**
   * Generates a signed url for reading a file in bulk.
   */
  @Post('bulk/uuid')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getBulkReadUrl(
    @Body() body: BulkReadFileDTO,
    @Req() request: Request,
    @RealIP() ip: string,
  ): Promise<BulkReadSignedUrlResult> {
    const data: BulkReadFileBO = {
      ...body,
      ip,
      userAgent: request.headers['user-agent'],
    };
    return this.fileService.bulkGenerateReadSignedUrl(
      data,
      request['user'].projectId,
      request['user'].isAdmin,
    );
  }

  /**
   * Generates a signed url for writing a file.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  getUploadUrl(
    @Body() body: RegisterFileDTO,
    @Req() request: Request,
  ): Promise<WriteSignedUrlResult> {
    const projectId = request['user'].isAdmin
      ? body.projectId
        ? body.projectId
        : request['user'].projectId
      : request['user'].projectId;

    const registerFile: RegisterFileBO = {
      ...body,
      projectId,
      createdBy: request['user'].projectId,
    };
    return this.fileService.generateUploadSignedUrl(registerFile);
  }

  /**
   * Confirms that a file has been uploaded.
   */
  @Put('confirm')
  @UseGuards(JwtAuthGuard)
  confirm(@Body() body: ConfirmFileUploadedDTO): Promise<ConfirmUploadResult> {
    return this.fileService.confirmUpload(body.uuid);
  }
}
