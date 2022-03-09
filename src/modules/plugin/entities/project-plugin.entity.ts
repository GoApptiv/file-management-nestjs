import { Project } from 'src/modules/auth/entities/project.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Plugin } from './plugin.entity';

@Entity('project_plugins')
export class ProjectPlugin extends AbstractEntity {
  @Column()
  projectId: string;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column()
  pluginId: string;

  @ManyToOne(() => Plugin, (plugin) => plugin.id)
  @JoinColumn({ name: 'plugin_id' })
  plugin: Plugin;
}
