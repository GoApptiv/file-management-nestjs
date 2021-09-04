import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { MimeType } from '../entity/mime-type.entity';

@EntityRepository(MimeType)
export class MimeTypeRepository extends Repository<MimeType> {}
