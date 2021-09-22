import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class BulkReadFileDTO {
  @ApiProperty({
    description: 'lists of uuids provided during file registration',
    example: [
      'e6560e1edc688086df39d4c43860cc129bc9ed40',
      '96cf3bb32d9a0c6145d8f5eb04df6d41cae242ff',
    ],
  })
  @IsArray()
  uuids: [];
}
