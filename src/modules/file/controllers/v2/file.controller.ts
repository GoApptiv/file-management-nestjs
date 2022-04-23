import { Get, Param, Put, Req, UseGuards, Request } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ResponseSuccess } from 'src/shared/interfaces/response-success.interface';
import { RestResponse } from 'src/shared/services/rest-response.service';
import { CreateFileVariantBO } from '../../bo/create-file-variant.bo';
import { UpdateFileVariantBO } from '../../bo/update-file-variant.bo';
import { ArchiveFileDTO } from '../../dto/archive-file.dto';
import { CreateFileVariantDTO } from '../../dto/create-file-variant-dto';
import { CfFileVariantStatusResponseDTO } from '../../dto/cf-file-variant-response.dto';
import { FileService } from '../../services/file.service';
import { CfFileVariantResponseMessage } from '../../interfaces/cf-file-variant-response-message.interface';

@Controller({
  path: 'files',
  version: '2',
})
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * archives a file.
   */
  @Put('archive')
  @UseGuards(JwtAuthGuard)
  async archive(@Body() body: ArchiveFileDTO): Promise<ResponseSuccess> {
    const result = await this.fileService.archiveDirectory(body.uuid);
    return RestResponse.success(result);
  }

  /**
   * generates a signed url for all the variants of the file.
   */
  @Get('variants/uuid/:uuid')
  @UseGuards(JwtAuthGuard)
  async createFileVariants(
    @Param() params: any,
    @Req() request: Request,
  ): Promise<ResponseSuccess> {
    const response = await this.fileService.generateFileVariantReadSignedUrl(
      params.uuid,
      request['user'].projectId,
    );

    return RestResponse.success(response);
  }

  /**
   * creates a file variant.
   */
  @Post('variants')
  @UseGuards(JwtAuthGuard)
  async getFileVariantsReadUrl(
    @Body() body: CreateFileVariantDTO,
    @Req() request: Request,
  ): Promise<ResponseSuccess> {
    const createVariant = new CreateFileVariantBO(body);
    const variants = await this.fileService.createFileVariants(
      createVariant,
      request['user'].projectId,
    );

    const response = {
      uuid: body.uuid,
      plugin: variants,
    };
    return RestResponse.success(response);
  }

  /**
   * updates a file variant status from cloud function response.
   */
  @Post('variants/cf-status-response')
  async updateFileVariantStatus(
    @Body() body: CfFileVariantStatusResponseDTO,
  ): Promise<ResponseSuccess> {
    const buf = Buffer.from(body.message.data, 'base64');
    const data: CfFileVariantResponseMessage = JSON.parse(buf.toString());

    const response = this.fileService.updateFileVariantByCfResponse(
      data.message.variantId,
      new UpdateFileVariantBO({
        filePath: data.message.filePath,
        fileName: data.message.fileName,
        cfStatus: data.message.status,
        messageId: body.message.messageId,
      }),
    );
    return RestResponse.success(response);
  }
}
