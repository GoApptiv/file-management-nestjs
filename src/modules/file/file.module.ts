import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/app-config.service';
import { CloudPubSubService } from 'src/shared/services/cloud-pubsub.service';
import { BucketConfigRepository } from '../auth/repositories/bucket-config.repository';
import { ProjectRepository } from '../auth/repositories/project.repository';
import { FileController as FileControllerV1 } from './controllers/v1/file.controller';
import { FileController as FileControllerV2 } from './controllers/v2/file.controller';
import { PluginController as PluginControllerV2 } from './controllers/v2/plugin.controller';
import { LogBulkFileAccessedListener } from './listeners/log-bulk-file-accessed.listener';
import { LogFileAccessedListener } from './listeners/log-file-accessed.listener';
import { AchiveFileListener } from './listeners/archive-file.listener';
import { AccessLogRepository } from './repositories/access-log.repository';
import { FileVariantLogRepository } from './repositories/file-variant-log.repository';
import { FileVariantRepository } from './repositories/file-variant.repository';
import { FileRepository } from './repositories/file.repository';
import { MimeTypeRepository } from './repositories/mime-type.repository';
import { TemplateRepository } from './repositories/template.repository';
import { FileService } from './services/file.service';
import { File } from './entities/file.entity';
import { Template } from './entities/template.entity';
import { MimeType } from './entities/mime-type.entity';
import { BucketConfig } from '../auth/entities/bucket-config.entity';
import { Project } from '../auth/entities/project.entity';
import { AccessLog } from './entities/access-log.entity';
import { FileVariantLog } from './entities/file-variant-log.entity';
import { FileVariant } from './entities/file-variant.entity';
import { Plugin } from './entities/plugin.entity';
import { PluginRepository } from './repositories/plugin.repository';
import { PluginService } from './services/plugin.service';
import { FileCronController } from './controllers/v1/file-cron.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      File,
      Template,
      MimeType,
      AccessLog,
      Project,
      BucketConfig,
      FileVariant,
      FileVariantLog,
      Plugin,
    ]),
  ],
  controllers: [
    FileControllerV1,
    FileControllerV2,
    PluginControllerV2,
    FileCronController,
  ],
  providers: [
    FileService,
    PluginService,
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
    LogFileAccessedListener,
    AchiveFileListener,
    LogBulkFileAccessedListener,
    FileRepository,
    TemplateRepository,
    MimeTypeRepository,
    AccessLogRepository,
    ProjectRepository,
    BucketConfigRepository,
    FileVariantRepository,
    FileVariantLogRepository,
    PluginRepository,
  ],
})
export class FileModule {}
