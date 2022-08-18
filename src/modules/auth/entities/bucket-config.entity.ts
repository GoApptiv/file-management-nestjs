import { Exclude } from 'class-transformer';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('bucket_configs')
export class BucketConfig extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column({ type: 'longtext' })
  key: string;
}
