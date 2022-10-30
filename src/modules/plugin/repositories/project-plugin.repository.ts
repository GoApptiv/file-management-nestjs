import { Injectable } from '@nestjs/common';
import { Status } from 'src/shared/constants/status.enum';
import { DataSource, Repository } from 'typeorm';
import { StoreProjectPluginDAO } from '../dao/project-plugin.dao';
import { ProjectPlugin } from '../entities/project-plugin.entity';

@Injectable()
export class ProjectPluginRepository extends Repository<ProjectPlugin> {
  constructor(dataSource: DataSource) {
    super(ProjectPlugin, dataSource.manager);
  }

  /**
   * Creates new record
   */
  store(data: StoreProjectPluginDAO): Promise<ProjectPlugin> {
    return this.save(data);
  }

  /**
   * Finds entity which matches the projectId and pluginId
   */
  findByProjectIdAndPluginId(
    projectId: number,
    pluginId: number,
  ): Promise<ProjectPlugin> {
    return this.findOne({
      where: { projectId, pluginId },
    });
  }

  /**
   * Updates the status by projectId and pluginId
   */
  async updateStatusByProjectIdAndPluginId(
    status: Status,
    projectId: number,
    pluginId: number,
  ): Promise<boolean> {
    const update = await this.update({ projectId, pluginId }, { status });
    return update.affected > 0 ? true : false;
  }
}
