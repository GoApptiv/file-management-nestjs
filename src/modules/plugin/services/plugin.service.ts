import { Injectable } from '@nestjs/common';
import { Status } from 'src/shared/constants/status.enum';
import { FilterPluginDAO } from '../dao/plugin.dao';
import { Plugin } from '../entities/plugin.entity';
import { PluginRepository } from '../repositories/plugin.repository';

@Injectable()
export class PluginService {
  constructor(private readonly pluginRepository: PluginRepository) {}

  /**
   * returns an action that fetches the plugins.
   */
  async fetch(): Promise<Plugin[]> {
    const filters: FilterPluginDAO = {
      status: Status.ACTIVE,
    };
    return await this.pluginRepository.fetch(['id', 'name', 'code'], filters);
  }
}
