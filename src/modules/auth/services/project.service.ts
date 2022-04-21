import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectPluginDAO } from 'src/modules/plugin/dao/project-plugin.dao';
import { ProjectPluginRegisteredEvent } from 'src/modules/plugin/events/project-plugin-registered.event';
import { InvalidPluginException } from 'src/modules/plugin/exceptions/invalid-plugin.exception';
import { PluginRepository } from 'src/modules/plugin/repositories/plugin.repository';
import { ProjectPluginRepository } from 'src/modules/plugin/repositories/project-plugin.repository';
import { Status } from 'src/shared/constants/status.enum';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable()
export class ProjectService {
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
    const plugin = await this.pluginRepository.findByCode(pluginCode);

    if (plugin === undefined) {
      throw new InvalidPluginException('Plugin does not exist');
    }

    const project = await this.projectRepository.findById(projectId);

    const projectPlugins =
      await this.projectPluginRepository.findByProjectIdAndPluginId(
        projectId,
        plugin.id,
      );

    if (projectPlugins !== undefined) {
      throw new InvalidPluginException('Plugin already registered');
    }

    if (webhookUrl.includes('https') === false) {
      throw new InvalidPluginException('Webhook URL must be HTTPS');
    }

    // Register the plugin
    const projectPlugin = new ProjectPluginDAO();
    projectPlugin.pluginId = plugin.id;
    projectPlugin.projectId = projectId;
    projectPlugin.webhookUrl = webhookUrl;
    projectPlugin.pubsubStatusSubscriber =
      this.generatePluginStatusSubscriberName(plugin.code, project.code);
    projectPlugin.status = Status.INACTIVE;

    const mapProjectPlugin = await this.projectPluginRepository.store(
      projectPlugin,
    );

    if (mapProjectPlugin == undefined) {
      return false;
    }

    // Raise event
    const eventData = new ProjectPluginRegisteredEvent();
    eventData.pluginId = plugin.id;
    eventData.projectId = projectId;

    this.eventEmitter.emit('project-plugin.registered', eventData);

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
