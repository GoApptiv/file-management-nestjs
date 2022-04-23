import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

class PluginDTO {
  @IsString()
  code: string;
}

export class CreateFileVariantDTO {
  @IsString()
  uuid: string;

  @IsArray()
  @ValidateNested()
  @Type(() => PluginDTO)
  plugins: PluginDTO[];
}
