import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CloudStorageService } from 'src/shared/services/cloud-storage.service';
import { UtilsService } from 'src/shared/services/utils.service';
import { FileArchiveEvent } from '../events/file-archive.event';
import { FileRepository } from '../repositories/file.repository';

@Injectable()
export class AchiveFileListener {
  private readonly logger = new Logger(FileArchiveEvent.name);

  constructor(private readonly fileRepository: FileRepository) {}

  @OnEvent('file.archive')
  async handleFileArchiveEvent(event: FileArchiveEvent): Promise<void> {
    this.logger.log(`archive file with id: ${event.id} started`);

    try {
      const file = await this.fileRepository.findOne({
        where: { id: event.id },
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

      await this.fileRepository.updateIsArchivedByUuid(file.uuid, true);

      this.logger.log(`archive file with id: ${event.id} completed`);
    } catch (error) {
      this.logger.warn(`ARCHIVE DIRECTORY FAILED FOR: ${event.id}`);
    }
  }
}
