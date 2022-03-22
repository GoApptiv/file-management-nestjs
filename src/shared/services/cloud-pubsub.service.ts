import {
  CreateSubscriptionOptions,
  CreateSubscriptionResponse,
  PubSub,
} from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';

@Injectable()
export class CloudPubSubService {
  private client: PubSub;

  constructor(config: AppConfigService) {
    this.client = new PubSub({
      credentials: {
        private_key: config.gcpCredentials.pubSub.privateKey,
        client_email: config.gcpCredentials.pubSub.email,
      },
      projectId: config.gcpCredentials.projectId,
    });
  }

  async publishMessage(
    topicName: string,
    data: Record<any, any>,
  ): Promise<string> {
    try {
      const message = await this.client
        .topic(topicName)
        .publishMessage({ json: data });
      return message;
    } catch (e) {
      return null;
    }
  }

  async createPushSubscription(
    topicName: string,
    subscriptionName: string,
    subscriptionOptions: CreateSubscriptionOptions,
  ): Promise<CreateSubscriptionResponse> {
    const subscriber = await this.client
      .topic(topicName)
      .createSubscription(subscriptionName, subscriptionOptions);

    return subscriber;
  }
}
