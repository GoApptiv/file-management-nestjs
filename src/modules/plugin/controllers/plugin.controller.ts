import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ResponseSuccess } from 'src/shared/interfaces/response-success.interface';
import { RestResponse } from 'src/shared/services/rest-response.service';
import { PluginService } from '../services/PluginService';

@Controller({
  path: 'plugins',
  version: '1',
})
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Get()
  /**
   * Fetches Plugins.
   *
   * @returns {Promise<ResponseSuccess>}
   */
  async index(): Promise<ResponseSuccess> {
    const data = await this.pluginService.fetch();
    return RestResponse.success(data);
  }
}
