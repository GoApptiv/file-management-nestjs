import { IsString, IsUrl } from 'class-validator';

export class RegisterPluginDTO {
  @IsString()
  pluginCode: string;

  @IsUrl()
  webhookUrl: string;
}
