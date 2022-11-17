import { FileStatus } from 'src/shared/constants/file-status.enum';
import { Project } from 'src/modules/auth/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MimeType } from './mime-type.entity';
import { Template } from './template.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uuid: string;

  @Column()
  referenceNumber: string;

  @Column()
  templateId: number;

  @ManyToOne(() => Template, (template) => template.id)
  @JoinColumn({ name: 'template_id' })
  template: Template;

  @Column({ type: 'enum', enum: FileStatus, default: FileStatus.REQUESTED })
  @Index()
  status: FileStatus;

  @Column()
  storagePath: string;

  @Column()
  isUploaded: boolean;

  @Column()
  @Index()
  isArchived: boolean;

  @Column({ unsigned: true })
  fileSize: number;

  @Column()
  mimeTypeId: number;

  @ManyToOne(() => MimeType, (mimeType) => mimeType.id)
  @JoinColumn({ name: 'mime_type_id' })
  mimeType: MimeType;

  @Column()
  @Index()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  @Index()
  createdBy: number;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'created_by' })
  creator: Project;

  @Column({ nullable: true })
  archivalDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
