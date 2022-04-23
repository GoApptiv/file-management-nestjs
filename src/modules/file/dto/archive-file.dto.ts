import { IsString } from 'class-validator';

export class ArchiveFileDTO {
  @IsString()
  uuid: string;
}
