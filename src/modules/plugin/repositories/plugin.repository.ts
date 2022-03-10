import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { PluginDAO } from '../dao/plugin.dao';
import { Plugin } from '../entities/plugin.entity';

@EntityRepository(Plugin)
export class PluginRepository extends Repository<Plugin> {
  /**
   * Returns an action that fetches the plugins
   */
  async fetch(
    select: (keyof Plugin)[] = [],
    filters: PluginDAO,
  ): Promise<Plugin[]> {
    return await this.find({
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
  async findById(
    id: number,
    relations?: (keyof Plugin)[] | string[],
  ): Promise<Plugin> {
    return await this.findOne({ where: { id }, relations: relations });
  }

  /**
   * Finds entity which matches the code
   */
  async findByCode(
    code: string,
    relations?: (keyof Plugin)[] | string[],
  ): Promise<Plugin> {
    return await this.findOne({ where: { code }, relations: relations });
  }
}
