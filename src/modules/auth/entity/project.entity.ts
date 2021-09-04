import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('projects')
export class Project extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;
}
