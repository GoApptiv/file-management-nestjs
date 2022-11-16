import { Project } from 'src/modules/auth/entities/project.entity';
import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { File } from './file.entity';
import { Plugin } from './plugin.entity';

@Entity('file_variants')
export class FileVariant extends AbstractEntity {
  @Column()
  fileId: number;

  @ManyToOne(() => File, (file) => file.id)
  @JoinColumn({ name: 'file_id' })
  file: File;

  @Column()
  pluginId: number;

  @ManyToOne(() => Plugin, (plugin) => plugin.id)
  @JoinColumn({ name: 'plugin_id' })
  plugin: Plugin;

  @Column({ nullable: true })
  storagePath: string;

  @Column()
  createdBy: number;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'created_by' })
  creator: Project;

  @Column({
    type: 'enum',
    enum: FileVariantStatus,
    default: FileVariantStatus.REQUESTED,
  })
  status: FileVariantStatus;
}
