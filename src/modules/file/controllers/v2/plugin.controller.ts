import {
  GaRestResponse,
  ResponseError,
  ResponseSuccess,
} from '@goapptiv/rest-response-nestjs';
import { Get, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PluginService } from '../../services/plugin.service';

@Controller({
  path: 'plugins',
  version: '2',
})
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  /**
   * Fetch plugins
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async index(): Promise<ResponseSuccess | ResponseError> {
    const data = await this.pluginService.fetch();
    return GaRestResponse.success(data);
  }
}
