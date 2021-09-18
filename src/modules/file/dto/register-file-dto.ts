import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsMimeType,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
class FileDTO {
  @ApiProperty({
    description: 'Name of the file with extension',
    example: 'ufo.png',
  })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Size of the file in bytes', example: 2048 })
  @IsInt()
  size: number;

  @ApiProperty({ description: 'Mime type of the file', example: 'image/png' })
  @IsMimeType()
  type: string;
}
export class RegisterFileDTO {
  @ApiProperty({
    description:
      'Unique reference number at entity application end, which will be used to uniquely identify the request.',
    example: 'REFERENCE-1',
  })
  @IsString()
  referenceNumber: string;

  @ApiProperty({ description: 'Registered file template', example: 'DOCUMENT' })
  @IsString()
  templateCode: string;

  @ApiProperty({
    description: 'File metadata for validations',
    type: () => FileDTO,
  })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => FileDTO)
  file: FileDTO;
}
