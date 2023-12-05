import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FilterPluginDAO } from '../dao/plugin.dao';
import { Plugin } from '../entities/plugin.entity';

@Injectable()
export class PluginRepository extends Repository<Plugin> {
  constructor(dataSource: DataSource) {
    super(Plugin, dataSource.manager);
  }

  /**
   * Returns an action that fetches the plugins
   */
  fetch(
    select: (keyof Plugin)[] = [],
    filters: FilterPluginDAO,
  ): Promise<Plugin[]> {
    return this.find({
      select: select.length > 0 ? select : null,
      where: [
        {
          ...filters,
        },
      ],
    });
  }

  /**
   * Finds entity which matches the id
   */
  findById(
    id: number,
    relations?: (keyof Plugin)[] | string[],
  ): Promise<Plugin> {
    return this.findOne({ where: { id }, relations: relations });
  }

  /**
   * Finds entity which matches the code
   */
  findByCode(
    code: string,
    relations?: (keyof Plugin)[] | string[],
  ): Promise<Plugin> {
    return this.findOne({ where: { code }, relations: relations });
  }
}
