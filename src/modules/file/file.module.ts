import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsProvider } from 'src/shared/services/utils.service';
import { ProjectRepository } from '../auth/repositories/project.repository';
import { FileController } from './controllers/file.controller';
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
      ProjectRepository,
    ]),
  ],
  controllers: [FileController],
  providers: [FileService, UtilsProvider],
})
export class FileModule {}
