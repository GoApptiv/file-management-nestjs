import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BucketConfigRepository } from 'src/modules/auth/repositories/bucket-config.repository';
import { CloudStorageService } from 'src/shared/services/cloud-storage.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { FileDAO } from '../dao/file.dao';
import { FileArchiveEvent } from '../events/file-archive.event';
import { FileRepository } from '../repositories/file.repository';

@Injectable()
export class FileArchiveListener {
  private readonly logger = new Logger(FileArchiveEvent.name);

  constructor(
    private readonly fileRepository: FileRepository,
    private readonly bucketConfigRepository: BucketConfigRepository,
  ) {}

  @OnEvent('file.archive')
  async handleFileArchiveEvent(event: FileArchiveEvent) {
    this.logger.log(`ARCHIVE DIRECTORY STARTED FOR: ${event.id}`);

    const file = await this.fileRepository.findOne(event.id, {
      relations: ['template', 'template.bucketConfig'],
    });

    const storage = new CloudStorageService(
      file.template.bucketConfig.email,
      UtilsService.base64decodeKey(file.template.bucketConfig.key),
      file.template.bucketConfig.name,
    );

    if (event.isDirectory) {
      const directory = file.storagePath.split('/').slice(0, -1).join('/');
      await storage.setDirectoryStorageClassToArchive(directory);
    } else {
      await storage.setStorageClassToArchive(file.storagePath);
    }

    this.fileRepository.updateByUuid(
      file.uuid,
      new FileDAO({
        isArchived: true,
      }),
    );

    this.logger.log(`ARCHIVE DIRECTORY COMPLETED FOR: ${event.id}`);
  }
}
