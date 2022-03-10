import { Plugin } from 'src/modules/plugin/entities/plugin.entity';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { Project } from '../entities/project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  /**
   * Finds entity which matches the code
   */
  async findById(
    id: number,
    relations?: (keyof Project)[] | string[],
  ): Promise<Project> {
    return await this.findOne({ where: { id }, relations: relations });
  }

  /**
   * Finds entity which matches the code
   */
  async findByCode(
    code: string,
    relations?: (keyof Project)[] | string[],
  ): Promise<Project> {
    return await this.findOne({ where: { code }, relations: relations });
  }
}
