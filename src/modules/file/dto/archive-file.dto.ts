import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ArchiveFileDTO {
  @ApiProperty({
    description: 'uuid provided during file registration',
    example: '81713b3c17277dd1cf76ae0c9cef55d902083437',
  })
  @IsString()
  uuid: string;
}
