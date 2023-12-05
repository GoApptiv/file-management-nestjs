import {
  CreateSubscriptionOptions,
  CreateSubscriptionResponse,
  PubSub,
} from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CloudPubSubService {
  private client: PubSub;

  constructor(email: string, privateKey: string, projectId: string) {
    this.client = new PubSub({
      credentials: {
        // eslint-disable-next-line camelcase
        private_key: privateKey,
        // eslint-disable-next-line camelcase
        client_email: email,
      },
      projectId,
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
