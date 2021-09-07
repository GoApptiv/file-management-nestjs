import { FileStatus } from 'src/shared/constants/file-status';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Project } from 'src/modules/auth/entities/project.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MimeType } from './mime-type.entity';
import { Template } from './template.entity';

@Entity('files')
export class File extends AbstractEntity {
  @Column({ unique: true })
  hashId: string;

  @Column()
  referenceNumber: string;

  @Column()
  templateId: number;

  @ManyToOne(() => Template, (template) => template.id)
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column({ type: 'enum', enum: FileStatus, default: FileStatus.REQUESTED })
  status: FileStatus;

  @Column()
  storagePath: string;

  @Column()
  isUploaded: boolean;

  @Column()
  isArchieved: boolean;

  @Column({ unsigned: true })
  fileSize: number;

  @Column()
  mimeTypeId: number;

  @ManyToOne(() => MimeType, (mimeType) => mimeType.id)
  @JoinColumn({ name: 'mime_type_id' })
  mimeType: MimeType;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
