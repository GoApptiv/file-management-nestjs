import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Template } from './template.entity';

@Entity('mime_types')
export class MimeType extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  extension: string;

  @ManyToMany(() => Template, (template) => template.mimeTypes)
  templates: Template[];
}
