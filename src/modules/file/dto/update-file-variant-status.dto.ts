import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { FileVariantCfStatus } from 'src/shared/constants/file-variant-cf-status.enum';

export class UpdateFileVariantStatus {
  @ApiProperty({
    description: 'variant id provided during file variant creation',
    example: '2',
  })
  @IsNumber()
  variantId: number;

  @ApiProperty({
    description: 'file storage path in bucket',
    example: '/IMAGES/',
  })
  @IsString()
  filePath: string;

  @ApiProperty({
    description: 'file name stored in bucket',
    example: 'image.jpg',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'status of the file',
    example: 'created',
  })
  @IsString()
  status: FileVariantCfStatus;
}
