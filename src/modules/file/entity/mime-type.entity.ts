import { AbstractEntity } from 'src/common/entity/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('mime_types')
export class MimeType extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  extension: string;
}
