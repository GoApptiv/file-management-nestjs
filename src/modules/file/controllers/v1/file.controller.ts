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
   * generates a signed url for reading a file.
   */
  @Get('uuid/:uuid')
  @UseGuards(JwtAuthGuard)
  getReadUrl(
    @Param() params: any,
    @Req() request: Request,
    @RealIP() ip: string,
  ): Promise<ReadSignedUrlResult> {
    const readFile = new ReadFileBO();
    readFile.uuid = params.uuid;
    readFile.ip = ip;
    readFile.userAgent = request.headers['user-agent'];
    return this.fileService.generateReadSignedUrl(
      readFile,
      request['user'].projectId,
    );
  }

  /**
   * generates a signed url for reading a file in bulk.
   */
  @Post('bulk/uuid')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  getBulkReadUrl(
    @Body() body: BulkReadFileDTO,
    @Req() request: Request,
    @RealIP() ip: string,
  ): Promise<BulkReadSignedUrlResult> {
    const data = new BulkReadFileBO(body);
    data.ip = ip;
    data.userAgent = request.headers['user-agent'];
    return this.fileService.bulkGenerateReadSignedUrl(
      data,
      request['user'].projectId,
    );
  }

  /**
   * generates a signed url for writing a file.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  getUploadUrl(
    @Body() body: RegisterFileDTO,
    @Req() request: Request,
  ): Promise<WriteSignedUrlResult> {
    const registerFile = new RegisterFileBO(body);
    registerFile.projectId = request['user'].projectId;
    return this.fileService.generateUploadSignedUrl(registerFile);
  }

  /**
   * confirms that a file has been uploaded.
   */
  @Put('confirm')
  @UseGuards(JwtAuthGuard)
  confirm(@Body() body: ConfirmFileUploadedDTO): Promise<ConfirmUploadResult> {
    return this.fileService.confirmUpload(body.uuid);
  }
}
