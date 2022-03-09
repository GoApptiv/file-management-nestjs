import { Status } from 'src/shared/constants/status.enum';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('plugins')
export class Plugin extends AbstractEntity {
  @Column()
  name: string;

  @Index()
  @Column()
  code: string;

  @Column({ length: 400 })
  cloudFunctionUrl: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;
}
