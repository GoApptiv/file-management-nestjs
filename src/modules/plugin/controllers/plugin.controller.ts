import { Get, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ResponseSuccess } from 'src/shared/interfaces/response-success.interface';
import { RestResponse } from 'src/shared/services/rest-response.service';
import { PluginService } from '../services/plugin.service';

@Controller({
  path: 'plugins',
  version: '1',
})
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(): Promise<ResponseSuccess> {
    const data = await this.pluginService.fetch();
    return RestResponse.success(data);
  }
}
