import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BucketConfigRepository } from 'src/modules/auth/repositories/bucket-config.repository';
import { CloudStorageService } from 'src/shared/services/cloud-storage.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { FileDAO } from '../dao/file.dao';
import { FileArchiveEvent } from '../events/file-archive.event';
import { FileRepository } from '../repositories/file.repository';

@Injectable()
export class FileArchiveListener {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly bucketConfigRepository: BucketConfigRepository,
  ) {}

  @OnEvent('file.archive')
  async handleFileArchiveEvent(event: FileArchiveEvent) {
    const file = await this.fileRepository.findOne(event.id);

    const bucketConfig = await this.bucketConfigRepository.findByProjectId(
      file.projectId,
    );

    const storage = new CloudStorageService(
      bucketConfig.email,
      UtilsService.base64decodeKey(bucketConfig.key),
      bucketConfig.name,
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
  }
}
