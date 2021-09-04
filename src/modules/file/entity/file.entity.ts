import { FileStatus } from 'src/common/constants/file-status';
import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { Project } from 'src/modules/auth/entity/project.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MimeType } from './mime-type.entity';
import { Template } from './template.entity';

@Entity('files')
export class File extends AbstractEntity {
  @Column()
  hash_id: string;

  @Column()
  reference_number: string;

  @OneToMany(() => Template, (template) => template.id)
  template_id: Template;

  @Column({ type: 'enum', enum: FileStatus, default: FileStatus.REQUESTED })
  status: FileStatus;

  @Column()
  storage_path: string;

  @Column()
  is_uploaded: boolean;

  @Column()
  is_archieved: boolean;

  @Column({ unsigned: true })
  file_size: number;

  @OneToOne(() => MimeType)
  @JoinColumn()
  mime_type: number;

  @OneToOne(() => Project)
  @JoinColumn()
  project: number;
}
