import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { Template } from '../entities/template.entity';

@EntityRepository(Template)
export class TemplateRepository extends Repository<Template> {}
