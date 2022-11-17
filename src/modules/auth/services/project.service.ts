import {
  GaBadRequestException,
  GaConflictException,
} from '@goapptiv/exception-handler-nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PluginErrorCode } from 'src/modules/file/constants/errors.enum';
import { StoreProjectPluginDAO } from 'src/modules/file/dao/project-plugin.dao';
import { ProjectPluginRegisteredEvent } from 'src/modules/file/events/project-plugin-registered.event';
import { InvalidPluginException } from 'src/modules/file/exceptions/invalid-plugin.exception';
import { PluginRepository } from 'src/modules/file/repositories/plugin.repository';
import { ProjectPluginRepository } from 'src/modules/file/repositories/project-plugin.repository';
import { Status } from 'src/shared/constants/status.enum';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectPluginRepository: ProjectPluginRepository,
    private readonly pluginRepository: PluginRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * register plugin for the project
   */
  async registerPlugin(
    pluginCode: string,
    webhookUrl: string,
    projectId: number,
  ): Promise<boolean> {
    this.logger.log(
      `register plugin for project ${projectId} with plugin code ${pluginCode}`,
    );

    const plugin = await this.pluginRepository.findByCode(pluginCode);

    if (!plugin) {
      throw new InvalidPluginException(pluginCode);
    }

    const project = await this.projectRepository.findById(projectId);

    const projectPlugins =
      await this.projectPluginRepository.findByProjectIdAndPluginId(
        projectId,
        plugin.id,
      );

    if (projectPlugins) {
      throw new GaConflictException([
        {
          type: PluginErrorCode.E409_PLUGIN_ALREADY_REGISTERED,
          message: `plugin with code ${pluginCode} already registered`,
          context: {
            pluginCode,
          },
        },
      ]);
    }

    if (!webhookUrl.includes('https')) {
      throw new GaBadRequestException([
        {
          type: PluginErrorCode.E400_PLUGIN_INVALID_WEBHOOK_URL,
          message: `webhook url ${webhookUrl} is invalid, it must be https`,
          context: {
            webhookUrl,
          },
        },
      ]);
    }

    // Register the plugin
    const projectPlugin: StoreProjectPluginDAO = {
      pluginId: plugin.id,
      projectId,
      webhookUrl,
      pubsubStatusSubscriber: this.generatePluginStatusSubscriberName(
        plugin.code,
        project.code,
      ),
      status: Status.INACTIVE,
    };

    const mapProjectPlugin = await this.projectPluginRepository.store(
      projectPlugin,
    );

    if (!mapProjectPlugin) {
      return false;
    }

    // raise event
    const eventData = new ProjectPluginRegisteredEvent();
    eventData.pluginId = plugin.id;
    eventData.projectId = projectId;

    this.eventEmitter.emit('project-plugin.registered', eventData);

    this.logger.log(
      `plugin with code ${pluginCode} registered for project: ${projectId}`,
    );

    return true;
  }

  /**
   * generates a unique name for the subscriber for project and plugin
   */
  generatePluginStatusSubscriberName = (
    pluginCode: string,
    projectCode: string,
  ): string => {
    const name =
      projectCode.toLowerCase() +
      '-' +
      pluginCode.toLowerCase() +
      '-' +
      'status' +
      '-' +
      Date.now();

    return name;
  };
}
