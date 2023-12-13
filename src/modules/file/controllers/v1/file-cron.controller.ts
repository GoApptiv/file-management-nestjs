import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  GaRestResponse,
  ResponseError,
  ResponseSuccess,
} from '@goapptiv/rest-response-nestjs';
import { FileService } from '../../services/file.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller({
  path: 'crons/files',
  version: '1',
})
export class FileCronController {
  constructor(private readonly fileService: FileService) {}

  /*
   * Fails the queued file variants
   */
  @Post('fail-queued-file-variants')
  @UseGuards(JwtAuthGuard)
  async failQueuedFileVariants(): Promise<ResponseSuccess | ResponseError> {
    const data = await this.fileService.failQueuedFileVariants();
    return GaRestResponse.success({
      status: data,
    });
  }

  /*
   * Archive the file which passed the archival date
   */
  @Post('archive-archival-date-passed-files')
  @UseGuards(JwtAuthGuard)
  async archiveArchivalDatePassedFiles(): Promise<
    ResponseSuccess | ResponseError
  > {
    const data = await this.fileService.archiveArchivalDatePassedFiles();
    return GaRestResponse.success({
      status: data,
    });
  }
}
