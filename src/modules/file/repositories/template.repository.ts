import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { Template } from '../entities/template.entity';

@EntityRepository(Template)
export class TemplateRepository extends Repository<Template> {
  /**
   * Finds entity which matches the type
   */
  async findByCode(
    code: string,
    relations?: (keyof Template)[] | string[],
  ): Promise<Template> {
    return await this.findOne({ where: { code }, relations: relations });
  }
}
