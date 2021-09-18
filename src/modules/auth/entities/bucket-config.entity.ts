import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity('bucket_configs')
export class BucketConfig extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column({ type: 'longtext' })
  key: string;

  @Column()
  projectId: number;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  constructor(partial: Partial<BucketConfig>) {
    super();
    Object.assign(this, partial);
  }
}
