import { Plugin } from 'src/modules/plugin/entities/plugin.entity';
import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { File } from './file.entity';

@Entity('file_variant_logs')
export class FileVariantLog extends AbstractEntity {
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

  @Column()
  status: FileVariantStatus;

  @Column({ nullable: true })
  creationTopicMessageId: string;
}
