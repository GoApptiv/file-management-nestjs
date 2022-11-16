import { Project } from 'src/modules/auth/entities/project.entity';
import { Status } from 'src/shared/constants/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Plugin } from './plugin.entity';

@Entity('project_plugins')
export class ProjectPlugin {
  @PrimaryColumn()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @PrimaryColumn()
  pluginId: number;

  @ManyToOne(() => Plugin, (plugin) => plugin.id)
  @JoinColumn({ name: 'plugin_id' })
  plugin: Plugin;

  @Column({ type: 'longtext', nullable: true })
  webhookUrl: string;

  @Column({ nullable: true })
  pubsubStatusSubscriber: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
