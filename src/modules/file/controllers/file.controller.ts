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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RealIP } from 'nestjs-real-ip';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ResponseSuccess } from 'src/shared/interfaces/response-success.interface';
import { RestResponse } from 'src/shared/services/rest-response.service';
import { BulkReadFileBo } from '../bo/bulk-read-file.bo';
import { CreateFileVariantBO } from '../bo/create-file-variant.bo';
import { ReadFileBo } from '../bo/read-file.bo';
import { RegisterFileBO } from '../bo/register-file.bo';
import { UpdateFileVariantBO } from '../bo/update-file-variant.bo';
import { ArchiveFileDTO } from '../dto/archive-file.dto';
import { BulkReadFileDTO } from '../dto/bulk-read-file.dto';
import { ConfirmFileUploadedDTO } from '../dto/confirm-file-uploaded.dto';
import { CreateFileVariantDTO } from '../dto/create-file-variant-dto';
import { RegisterFileDTO } from '../dto/register-file-dto';
import { UpdateFileVariantStatus } from '../dto/update-file-variant-status.dto';
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
  @UseGuards(JwtAuthGuard)
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
    @RealIP() ip: string,
  ): Promise<ReadSignedUrlResult> {
    const readFile = new ReadFileBo();
    readFile.uuid = params.uuid;
    readFile.ip = ip;
    readFile.userAgent = request.headers['user-agent'];
    return this.fileService.generateReadSignedUrl(
      readFile,
      request['user'].projectId,
    );
  }

  @Post('bulk/uuid')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
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
    @RealIP() ip: string,
  ): Promise<BulkReadSignedUrlResult> {
    const data = new BulkReadFileBo(dto);
    data.ip = ip;
    data.userAgent = request.headers['user-agent'];
    return this.fileService.bulkGenerateReadSignedUrl(
      data,
      request['user'].projectId,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  getUploadUrl(
    @Body() dto: RegisterFileDTO,
    @Req() request: Request,
  ): Promise<WriteSignedUrlResult> {
    const registerFile = new RegisterFileBO(dto);
    registerFile.projectId = request['user'].projectId;
    return this.fileService.generateUploadSignedUrl(registerFile);
  }

  @Put('confirm')
  @UseGuards(JwtAuthGuard)
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
  confirm(@Body() dto: ConfirmFileUploadedDTO): Promise<ConfirmUploadResult> {
    return this.fileService.confirmUpload(dto.uuid);
  }

  @Put('archive')
  @UseGuards(JwtAuthGuard)
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
  async archive(@Body() dto: ArchiveFileDTO): Promise<ResponseSuccess> {
    const result = await this.fileService.archiveDirectory(dto.uuid);
    return RestResponse.success(result);
  }

  @Post('variants')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'File variants',
    description: 'Creates different file variants',
  })
  async createFileVariants(
    @Body() dto: CreateFileVariantDTO,
    @Req() request: Request,
  ): Promise<ResponseSuccess> {
    const createVariant = new CreateFileVariantBO(dto);
    const variants = await this.fileService.createFileVariants(
      createVariant,
      request['user'].projectId,
    );

    const response = {
      uuid: dto.uuid,
      plugin: variants,
    };
    return RestResponse.success(response);
  }

  @Put('variants')
  async updateFileVariantStatus(
    @Body() dto: UpdateFileVariantStatus,
  ): Promise<ResponseSuccess> {
    const response = this.fileService.updateFileVariantByCfResponse(
      dto.variantId,
      new UpdateFileVariantBO({
        filePath: dto.filePath,
        fileName: dto.fileName,
        cfStatus: dto.status,
      }),
    );
    return RestResponse.success(response);
  }
}
