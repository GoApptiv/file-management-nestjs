import { IAMCredentialsClient } from '@google-cloud/iam-credentials';
import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Injectable()
export class CloudIAMService {
  private client: IAMCredentialsClient;

  /**
   *
   * @param email - The email id of the Google Cloud Service account.
   * @param privateKey - The private key of the service account.
   */
  constructor(email: string, privateKey: string) {
    this.client = new IAMCredentialsClient({
      credentials: {
        // eslint-disable-next-line camelcase
        client_email: email,
        // eslint-disable-next-line camelcase
        private_key: privateKey,
      },
      projectId: UtilsService.extractProjectIdFromGcpEmailId(email),
    });
  }

  /**
   * Generates access token
   */
  async generateAccessToken(
    serviceAccount: string,
    scope: Array<string>,
    lifetimeInSeconds?: number,
  ): Promise<{ accessToken: string; expireTime: string | number | Long }> {
    const [token] = await this.client.generateAccessToken({
      name: serviceAccount,
      scope: scope,
      lifetime: { seconds: lifetimeInSeconds },
    });

    return {
      accessToken: token.accessToken,
      expireTime: token.expireTime.seconds,
    };
  }
}
