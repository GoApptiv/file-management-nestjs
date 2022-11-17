import { CreateSubscriptionOptions } from '@google-cloud/pubsub';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Status } from 'src/shared/constants/status.enum';
import { CloudPubSubService } from 'src/shared/services/cloud-pubsub.service';
import { ProjectPluginRegisteredEvent } from '../events/project-plugin-registered.event';
import { PluginRepository } from '../repositories/plugin.repository';
import { ProjectPluginRepository } from '../repositories/project-plugin.repository';

@Injectable()
export class RegisterPluginStatusSubscriberListener {
  private readonly logger = new Logger(
    RegisterPluginStatusSubscriberListener.name,
  );

  constructor(
    private readonly projectPluginRepository: ProjectPluginRepository,
    private readonly pluginRepository: PluginRepository,
    private readonly cloudPubSubService: CloudPubSubService,
  ) {}

  @OnEvent('project-plugin.registered')
  async handleProjectPluginRegisteredEvent(
    event: ProjectPluginRegisteredEvent,
  ) {
    try {
      const plugin = await this.pluginRepository.findById(event.pluginId);

      const projectPlugin =
        await this.projectPluginRepository.findByProjectIdAndPluginId(
          event.projectId,
          event.pluginId,
        );

      const subscriberOption: CreateSubscriptionOptions = {
        ackDeadlineSeconds: 60,
        filter: `attributes.projectId = "${event.projectId}"`,
        pushConfig: {
          pushEndpoint: projectPlugin.webhookUrl,
        },
      };

      const subscriber = await this.cloudPubSubService.createPushSubscription(
        plugin.cloudFunctionResponseTopic,
        projectPlugin.pubsubStatusSubscriber,
        subscriberOption,
      );

      if (subscriber) {
        await this.projectPluginRepository.updateStatusByProjectIdAndPluginId(
          Status.ACTIVE,
          event.projectId,
          event.pluginId,
        );
      }
    } catch (error) {
      this.logger.warn(`ERROR IN REGISTERING SUBSCRIBER: ${error}`);
    }
  }
}
