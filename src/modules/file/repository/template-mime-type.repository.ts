import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { TemplateMimeType } from '../entity/template-mime-type.entity';

@EntityRepository(TemplateMimeType)
export class TemplateMimeTypeRepository extends Repository<TemplateMimeType> {}
