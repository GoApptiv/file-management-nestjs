import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { Project } from 'src/modules/auth/entity/project.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('templates')
export class Template extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  base_storage_path: string;

  @OneToOne(() => Project)
  @JoinColumn()
  project: Project;

  @Column({ nullable: true })
  min_size: number;

  @Column({ unsigned: true, nullable: true })
  max_size: number;

  @Column({ nullable: true, unsigned: true })
  expiry_time: number;
}
