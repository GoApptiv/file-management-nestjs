import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class MessageDTO {
  @ApiProperty({
    description: 'base64 encoded message',
    example:
      'eyJtZXNzYWdlIjogeyJ1dWlkIjogIjkzMWIzZWJkZDFjMzNmOWI5MWQ0ODk0YTE3YjhjZTgzZDM2YmZkNTEiLCAidmFyaWFudElkIjogMzgsICJmaWxlUGF0aCI6ICJJTlZPSUNFUy9DUEFJU0EtMTgiLCAiZmlsZU5hbWUiOiAidGVzdC5wbmciLCAic3RhdHVzIjogInN1Y2Nlc3MifX0=',
  })
  @IsString()
  data: string;

  @ApiProperty({
    description: 'message id',
    example: '2070443601311540',
  })
  @IsString()
  messageId: string;

  @ApiProperty({
    description: 'message publish time',
    example: '2021-02-26T19:13:55.749Z',
  })
  @IsDateString()
  publishTime: Date;
}

export class CfFileVariantStatusResponseDTO {
  @ApiProperty({
    description: 'variant id provided during file variant creation',
    example: '2',
  })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => MessageDTO)
  message: MessageDTO;
}
