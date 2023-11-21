import { Controller, Post } from '@nestjs/common';
import { Role } from 'src/modules/auth/constants/role.enum';
import { AuthGuard } from 'src/modules/auth/decorators/auth-guard.decorator';
import {
  GaRestResponse,
  ResponseError,
  ResponseSuccess,
} from '@goapptiv/rest-response-nestjs';
import { FileService } from '../../services/file.service';

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
  @AuthGuard(Role.CRON_MANAGER)
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
  @AuthGuard(Role.CRON_MANAGER)
  async archiveArchivalDatePassedFiles(): Promise<
    ResponseSuccess | ResponseError
  > {
    const data = await this.fileService.archiveArchivalDatePassedFiles();
    return GaRestResponse.success({
      status: data,
    });
  }
}
