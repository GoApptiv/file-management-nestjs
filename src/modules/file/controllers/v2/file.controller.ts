import {
  Get,
  Param,
  Put,
  Req,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateFileVariantBO } from '../../bo/create-file-variant.bo';
import { UpdateFileVariantBO } from '../../bo/update-file-variant.bo';
import { ArchiveFileDTO } from '../../dto/archive-file.dto';
import { CreateFileVariantDTO } from '../../dto/create-file-variant-dto';
import { CfFileVariantStatusResponseDTO } from '../../dto/cf-file-variant-response.dto';
import { FileService } from '../../services/file.service';
import { CfFileVariantResponseMessage } from '../../interfaces/cf-file-variant-response-message.interface';
import { RealIP } from 'nestjs-real-ip';
import { ReadFileBO } from '../../bo/read-file.bo';
import { BulkReadFileDTO } from '../../dto/bulk-read-file.dto';
import { BulkReadFileBO } from '../../bo/bulk-read-file.bo';
import { RegisterFileDTO } from '../../dto/register-file-dto';
import { RegisterFileBO } from '../../bo/register-file.bo';
import { ConfirmFileUploadedDTO } from '../../dto/confirm-file-uploaded.dto';
import {
  GaRestResponse,
  ResponseError,
  ResponseSuccess,
} from '@goapptiv/rest-response-nestjs';

@Controller({
  path: 'files',
  version: '2',
})
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * Generates a signed url for reading a file.
   */
  @Get('uuid/:uuid')
  @UseGuards(JwtAuthGuard)
  async getReadUrl(
    @Param('uuid') uuid: string,
    @Req() request: Request,
    @RealIP() ip: string,
  ): Promise<ResponseSuccess | ResponseError> {
    const readFile: ReadFileBO = {
      uuid,
      ip,
      userAgent: request.headers['user-agent'],
    };

    const result = await this.fileService.generateReadSignedUrl(
      readFile,
      request['user'].projectId,
      request['user'].isAdmin,
    );

    return GaRestResponse.success(result);
  }

  /**
   * Generates a signed url for reading a file in bulk.
   */
  @Post('bulk/uuid')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getBulkReadUrl(
    @Body() body: BulkReadFileDTO,
    @Req() request: Request,
    @RealIP() ip: string,
  ): Promise<ResponseSuccess | ResponseError> {
    const data: BulkReadFileBO = {
      ...body,
      ip,
      userAgent: request.headers['user-agent'],
    };

    const result = await this.fileService.bulkGenerateReadSignedUrl(
      data,
      request['user'].projectId,
      request['user'].isAdmin,
    );

    return GaRestResponse.success(result);
  }

  /**
   * Generates a signed url for writing a file.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async getUploadUrl(
    @Body() body: RegisterFileDTO,
    @Req() request: Request,
  ): Promise<ResponseSuccess | ResponseError> {
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

    const result = await this.fileService.generateUploadSignedUrl(registerFile);

    return GaRestResponse.success(result);
  }

  /**
   * Confirms that a file has been uploaded.
   */
  @Put('confirm')
  @UseGuards(JwtAuthGuard)
  async confirm(
    @Body() body: ConfirmFileUploadedDTO,
  ): Promise<ResponseSuccess> {
    const result = await this.fileService.confirmUpload(body.uuid);
    return GaRestResponse.success(result);
  }

  /**
   * Archives a file.
   */
  @Put('archive')
  @UseGuards(JwtAuthGuard)
  async archive(
    @Body() body: ArchiveFileDTO,
  ): Promise<ResponseSuccess | ResponseError> {
    const result = await this.fileService.archiveDirectory(body.uuid);
    return GaRestResponse.success(result);
  }

  /**
   * Generates a signed url for all the variants of the file.
   */
  @Get('variants/uuid/:uuid')
  @UseGuards(JwtAuthGuard)
  async getFileVariantsReadUrl(
    @Param('uuid') uuid: string,
    @Req() request: Request,
  ): Promise<ResponseSuccess | ResponseError> {
    const response = await this.fileService.generateFileVariantReadSignedUrl(
      uuid,
      request['user'].projectId,
      request['user'].isAdmin,
    );

    return GaRestResponse.success(response);
  }

  /**
   * Creates a file variant.
   */
  @Post('variants')
  @UseGuards(JwtAuthGuard)
  async createFileVariants(
    @Body() body: CreateFileVariantDTO,
    @Req() request: Request,
  ): Promise<ResponseSuccess | ResponseError> {
    const createVariant: CreateFileVariantBO = { ...body };
    const variants = await this.fileService.createFileVariants(
      createVariant,
      request['user'].projectId,
      request['user'].isAdmin,
    );

    const result = {
      uuid: body.uuid,
      plugin: variants,
    };
    return GaRestResponse.success(result);
  }

  /**
   * Updates a file variant status from cloud function response.
   */
  @Post('variants/cf-status-response')
  async updateFileVariantStatus(
    @Body() body: CfFileVariantStatusResponseDTO,
  ): Promise<ResponseSuccess | ResponseError> {
    const buf = Buffer.from(body.message.data, 'base64');
    const data: CfFileVariantResponseMessage = JSON.parse(buf.toString());

    const updateData: UpdateFileVariantBO = {
      filePath: data.message.filePath,
      fileName: data.message.fileName,
      cfStatus: data.message.status,
      messageId: body.message.messageId,
    };

    const result = await this.fileService.updateFileVariantByCfResponse(
      data.message.variantId,
      updateData,
    );
    return GaRestResponse.success(result.toString());
  }
}
