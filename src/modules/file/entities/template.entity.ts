import { Project } from 'src/modules/auth/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MimeType } from './mime-type.entity';
import { BucketConfig } from 'src/modules/auth/entities/bucket-config.entity';

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  baseStoragePath: string;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ unsigned: true, nullable: true })
  minSizeInB: number;

  @Column({ unsigned: true, nullable: true })
  maxSizeInB: number;

  @Column({ unsigned: true })
  linkExpiryTimeInS: number;

  @ManyToMany(() => MimeType, (mimeType) => mimeType.templates)
  @JoinTable({ name: 'template_mime_types' })
  mimeTypes: MimeType[];

  @Column({ nullable: true, default: 30 })
  archiveAfterInD: number;

  @Column()
  bucketConfigId: number;

  @ManyToOne(() => BucketConfig, (bucketConfig) => bucketConfig.id)
  @JoinColumn({ name: 'bucket_config_id' })
  bucketConfig: BucketConfig;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
