import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { PluginDAO } from '../dto/Plugin.dto';
import { Plugin } from '../entities/plugin.entity';

@EntityRepository(Plugin)
export class PluginRepository extends Repository<Plugin> {
  /**
   * Returns an action that fetches the plugins
   *
   * @param {PluginDAO} filters
   * @param {(keyof Plugin)[]} select
   * @returns {Promise<Plugin[]>} - array of plugins
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
}
