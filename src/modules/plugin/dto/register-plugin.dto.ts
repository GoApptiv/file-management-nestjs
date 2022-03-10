import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class RegisterPluginDTO {
  @ApiProperty({
    description: 'Plugin code',
    example: 'GOOGLE_VISION',
  })
  @IsString()
  pluginCode: string;

  @ApiProperty({
    description: 'Status Callback URL',
    example: 'https://api.example.com/image/status',
  })
  @IsUrl()
  webhookUrl: string;
}
