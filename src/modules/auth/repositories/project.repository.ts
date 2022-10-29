import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectRepository extends Repository<Project> {
  constructor(dataSource: DataSource) {
    super(Project, dataSource.manager);
  }

  /**
   * Finds entity which matches the id
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
