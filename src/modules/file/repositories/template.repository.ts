import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Template } from '../entities/template.entity';

@Injectable()
export class TemplateRepository extends Repository<Template> {
  constructor(dataSource: DataSource) {
    super(Template, dataSource.manager);
  }

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
