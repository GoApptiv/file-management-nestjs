import { Plugin } from 'src/modules/plugin/entities/plugin.entity';
import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FileVariant } from './file-variant.entity';

@Entity('file_variant_logs')
export class FileVariantLog extends AbstractEntity {
  @Column()
  variantId: number;

  @ManyToOne(() => FileVariant, (fileVariant) => fileVariant.id)
  @JoinColumn({ name: 'variant_id' })
  fileVariant: FileVariant;

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
