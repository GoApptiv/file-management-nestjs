import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketConfigRepository } from '../auth/repositories/bucket-config.repository';
import { ProjectRepository } from '../auth/repositories/project.repository';
import { FileController } from './controllers/file.controller';
import { FileAccessedListener } from './listeners/file-accessed.listener';
import { AccessLogRepository } from './repositories/access-log.repository';
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
    ]),
  ],
  controllers: [FileController],
  providers: [FileService, FileAccessedListener],
})
export class FileModule {}
