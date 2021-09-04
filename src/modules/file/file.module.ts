import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from './repository/file.repository';
import { MimeTypeRepository } from './repository/mime-type.repository';
import { TemplateMimeTypeRepository } from './repository/template-mime-type.repository';
import { TemplateRepository } from './repository/template.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileRepository,
      TemplateRepository,
      MimeTypeRepository,
      TemplateMimeTypeRepository,
    ]),
  ],
})
export class FileModule {}
