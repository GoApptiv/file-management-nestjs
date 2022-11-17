import { Plugin } from 'src/modules/file/entities/plugin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Plugin, (plugin) => plugin.projects)
  @JoinTable({ name: 'project_plugins' })
  plugins: Plugin[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
