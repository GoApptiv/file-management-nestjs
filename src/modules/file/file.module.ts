import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/app-config.service';
import { CloudPubSubService } from 'src/shared/services/cloud-pubsub.service';
import { BucketConfigRepository } from '../auth/repositories/bucket-config.repository';
import { ProjectRepository } from '../auth/repositories/project.repository';
import { PluginRepository } from '../plugin/repositories/plugin.repository';
import { FileController } from './controllers/file.controller';
import { BulkFileAccessedListener } from './listeners/bulk-file-accessed.listener';
import { FileAccessedListener } from './listeners/file-accessed.listener';
import { FileArchiveListener } from './listeners/file-archive.listener';
import { AccessLogRepository } from './repositories/access-log.repository';
import { FileVariantLogRepository } from './repositories/file-variant-log.repository';
import { FileVariantRepository } from './repositories/file-variant.repository';
import { FileRepository } from './repositories/file.repository';
import { MimeTypeRepository } from './repositories/mime-type.repository';
import { TemplateRepository } from './repositories/template.repository';
import { FileService } from './services/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileRepository,
      TemplateRepository,
      MimeTypeRepository,
      AccessLogRepository,
      ProjectRepository,
      BucketConfigRepository,
      FileVariantRepository,
      FileVariantLogRepository,
      PluginRepository,
    ]),
  ],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: CloudPubSubService,
      useFactory: (configService: AppConfigService) => {
        return new CloudPubSubService(
          configService.gcpCredentials.pubSub.email,
          configService.gcpCredentials.pubSub.privateKey,
          configService.gcpCredentials.projectId,
        );
      },
      inject: [AppConfigService],
    },
    FileAccessedListener,
    FileArchiveListener,
    BulkFileAccessedListener,
  ],
})
export class FileModule {}
