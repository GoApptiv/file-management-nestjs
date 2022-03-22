import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';

export class UpdateFileVariantStatus {
  @ApiProperty({
    description: 'uuid provided during file registration',
    example: '81713b3c17277dd1cf76ae0c9cef55d902083437',
  })
  @IsString()
  uuid: string;

  @ApiProperty({
    description: 'variant id provided during file variant creation',
    example: '2',
  })
  @IsNumber()
  variantId: string;

  @ApiProperty({
    description: 'status of the file',
    example: 'created',
  })
  @IsString()
  status: FileVariantStatus;
}
