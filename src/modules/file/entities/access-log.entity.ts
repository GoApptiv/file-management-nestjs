import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('access_logs')
export class AccessLog extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  @Index()
  fileId: number;

  @Column()
  projectId: number;

  @Column()
  ip: string;

  @Column()
  userAgent: string;
}
