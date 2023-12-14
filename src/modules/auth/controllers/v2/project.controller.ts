import {
  GaRestResponse,
  ResponseError,
  ResponseSuccess,
} from '@goapptiv/rest-response-nestjs';
import { Body, Post, Req, UseGuards, Request } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RegisterPluginDTO } from 'src/modules/file/dto/register-plugin.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ProjectService } from '../../services/project.service';

@Controller({
  path: 'projects',
  version: '2',
})
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Registers a plugin for the project.
   */
  @Post('plugin')
  @UseGuards(JwtAuthGuard)
  async registerPlugin(
    @Body() body: RegisterPluginDTO,
    @Req() request: Request,
  ): Promise<ResponseSuccess | ResponseError> {
    const success = await this.projectService.registerPlugin(
      body.pluginCode,
      body.webhookUrl,
      request['user'].projectId,
    );

    if (!success) {
      return GaRestResponse.error('Error while adding plugin', {});
    }

    return GaRestResponse.success('Plugin added successfully');
  }
}
