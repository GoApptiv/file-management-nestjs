import { IsString } from 'class-validator';

export class ConfirmFileUploadedDTO {
  @IsString()
  uuid: string;
}
