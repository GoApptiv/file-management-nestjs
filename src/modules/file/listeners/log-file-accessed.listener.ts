import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AccessLogDAO } from '../dao/access-log.dao';
import { FileAccessedEvent } from '../events/file-accessed.event';
import { AccessLogRepository } from '../repositories/access-log.repository';

@Injectable()
export class LogFileAccessedListener {
  constructor(private readonly accessLogRepository: AccessLogRepository) {}

  @OnEvent('file.accessed')
  handleFileAccessedEvent(event: FileAccessedEvent) {
    const log = new AccessLogDAO(event);
    this.accessLogRepository.store(log);
  }
}
