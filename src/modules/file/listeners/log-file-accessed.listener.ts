import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StoreAccessLogDAO } from '../dao/access-log.dao';
import { FileAccessedEvent } from '../events/file-accessed.event';
import { FileArchiveEvent } from '../events/file-archive.event';
import { AccessLogRepository } from '../repositories/access-log.repository';

@Injectable()
export class LogFileAccessedListener {
  private readonly logger = new Logger(FileArchiveEvent.name);

  constructor(private readonly accessLogRepository: AccessLogRepository) {}

  @OnEvent('file.accessed')
  handleFileAccessedEvent(event: FileAccessedEvent) {
    try {
      const log: StoreAccessLogDAO = {
        ...event,
      };
      this.accessLogRepository.store(log);
    } catch (error) {
      this.logger.warn(`LOG FILE ACCESSED FAILED FOR: ${event.fileId}`);
    }
  }
}
