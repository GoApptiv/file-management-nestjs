import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileVariant } from './file-variant.entity';
import { Plugin } from './plugin.entity';

@Entity('file_variant_logs')
export class FileVariantLog {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
