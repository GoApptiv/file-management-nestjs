import { Project } from 'src/modules/auth/entities/project.entity';
import { Status } from 'src/shared/constants/status.enum';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';

@Entity('plugins')
export class Plugin extends AbstractEntity {
  @Column()
  name: string;

  @Index()
  @Column()
  code: string;

  @Column()
  cloudFunctionTopic: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @OneToMany(() => Project, (project) => project.plugins)
  @JoinColumn({ name: 'project_plugin' })
  projects: Project[];
}
