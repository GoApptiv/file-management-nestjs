import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

class PluginDTO {
  @ApiProperty({
    description: 'code of the plugin',
    example: 'GOOGLE_VISION',
  })
  @IsString()
  code: string;
}

export class CreateFileVariantDTO {
  @ApiProperty({
    description: 'uuid provided during file registration',
    example: '81713b3c17277dd1cf76ae0c9cef55d902083437',
  })
  @IsString()
  uuid: string;

  @ApiProperty({
    description: 'Plugin to be applied to the file',
    type: () => PluginDTO,
  })
  @IsArray()
  @ValidateNested()
  @Type(() => PluginDTO)
  plugins: PluginDTO[];
}
