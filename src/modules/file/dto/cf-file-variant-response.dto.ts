import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class MessageDTO {
  @IsString()
  data: string;

  @IsString()
  messageId: string;

  @IsDateString()
  publishTime: Date;
}

export class CfFileVariantStatusResponseDTO {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MessageDTO)
  message: MessageDTO;
}
