import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FileVariant } from './file-variant.entity';
import { Plugin } from './plugin.entity';

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

  @Column({
    type: 'enum',
    enum: FileVariantStatus,
    default: FileVariantStatus.REQUESTED,
  })
  status: FileVariantStatus;

  @Column({ nullable: true })
  messageId: string;
}
