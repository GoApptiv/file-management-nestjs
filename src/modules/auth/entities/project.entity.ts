import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('projects')
export class Project extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;
}
