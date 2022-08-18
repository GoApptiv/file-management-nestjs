import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AccessLogDAO } from '../dao/access-log.dao';
import { FileAccessedEvent } from '../events/file-accessed.event';
import { AccessLogRepository } from '../repositories/access-log.repository';

@Injectable()
export class LogBulkFileAccessedListener {
  constructor(private readonly accessLogRepository: AccessLogRepository) {}

  @OnEvent('bulk-file.accessed')
  handleFileAccessedEvent(event: FileAccessedEvent[]) {
    const logs: AccessLogDAO[] = [];
    event.forEach((accessEvent) => logs.push(new AccessLogDAO(accessEvent)));

    this.accessLogRepository.bulkStore(logs);
  }
}
