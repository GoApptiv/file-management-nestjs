import { Plugin } from 'src/modules/plugin/entities/plugin.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinTable, OneToMany } from 'typeorm';

@Entity('projects')
export class Project extends AbstractEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @OneToMany(() => Plugin, (plugin) => plugin.projects)
  @JoinTable({ name: 'project_plugins' })
  plugins: Plugin[];
}
