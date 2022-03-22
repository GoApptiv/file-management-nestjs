import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';

export class UpdateFileVariantStatus {
  @ApiProperty({
    description: 'variant id provided during file variant creation',
    example: '2',
  })
  @IsNumber()
  variantId: number;

  @ApiProperty({
    description: 'status of the file',
    example: 'created',
  })
  @IsString()
  status: FileVariantStatus;
}
