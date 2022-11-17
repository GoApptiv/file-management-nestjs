import { Project } from 'src/modules/auth/entities/project.entity';
import { Status } from 'src/shared/constants/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plugins')
export class Plugin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Index()
  code: string;

  @Column()
  cloudFunctionTopic: string;

  @Column()
  cloudFunctionResponseTopic: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @OneToMany(() => Project, (project) => project.plugins)
  @JoinColumn({ name: 'project_plugin' })
  projects: Project[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
