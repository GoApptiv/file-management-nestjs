import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Project } from 'src/modules/auth/entities/project.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { MimeType } from './mime-type.entity';

@Entity('templates')
export class Template extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  baseStoragePath: string;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn()
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
}
