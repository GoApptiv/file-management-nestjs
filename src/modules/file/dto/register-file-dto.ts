import { Type } from 'class-transformer';
import {
  IsInt,
  IsMimeType,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
class FileDTO {
  @IsString()
  name: string;

  @IsInt()
  size: number;

  @IsMimeType()
  type: string;
}
export class RegisterFileDTO {
  @IsString()
  referenceNumber: string;

  @IsString()
  templateCode: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => FileDTO)
  file: FileDTO;
}
