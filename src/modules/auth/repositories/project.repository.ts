import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { Project } from '../entities/project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  /**
   * Finds entity which matches the code
   */
  async findByCode(code: string, relations?: string[]): Promise<Project> {
    return await this.findOne({ where: { code }, relations: relations });
  }
}
