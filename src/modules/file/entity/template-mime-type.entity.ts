import { AbstractEntity } from 'src/common/entity/abstract.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MimeType } from './mime-type.entity';
import { Template } from './template.entity';

@Entity('template_mime_types')
export class TemplateMimeType extends AbstractEntity {
  @OneToOne(() => Template)
  @JoinColumn()
  template: Template;

  @OneToOne(() => MimeType)
  @JoinColumn()
  mime_type: MimeType;
}
