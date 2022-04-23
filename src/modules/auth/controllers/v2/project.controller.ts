import { Body, Post, Req, UseGuards, Request } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RegisterPluginDTO } from 'src/modules/plugin/dto/register-plugin.dto';
import { ResponseError } from 'src/shared/interfaces/response-error.interface';
import { ResponseSuccess } from 'src/shared/interfaces/response-success.interface';
import { RestResponse } from 'src/shared/services/rest-response.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ProjectService } from '../../services/project.service';

@Controller({
  path: 'projects',
  version: '2',
})
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

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
      return RestResponse.error('Error while adding plugin', {});
    }

    return RestResponse.success('Plugin added successfully');
  }
}
