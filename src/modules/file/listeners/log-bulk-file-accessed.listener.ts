import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StoreAccessLogDAO } from '../dao/access-log.dao';
import { FileAccessedEvent } from '../events/file-accessed.event';
import { AccessLogRepository } from '../repositories/access-log.repository';

@Injectable()
export class LogBulkFileAccessedListener {
  constructor(private readonly accessLogRepository: AccessLogRepository) {}

  @OnEvent('bulk-file.accessed')
  handleFileAccessedEvent(event: FileAccessedEvent[]) {
    const logs: StoreAccessLogDAO[] = [];
    event.forEach((accessEvent) =>
      logs.push({
        ...accessEvent,
      }),
    );

    this.accessLogRepository.bulkStore(logs);
  }
}
