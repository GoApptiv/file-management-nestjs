import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './controller/file.controller';
import { FileRepository } from './repository/file.repository';
import { MimeTypeRepository } from './repository/mime-type.repository';
import { TemplateMimeTypeRepository } from './repository/template-mime-type.repository';
import { TemplateRepository } from './repository/template.repository';
import { FileService } from './service/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileRepository,
      TemplateRepository,
      MimeTypeRepository,
      TemplateMimeTypeRepository,
    ]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
