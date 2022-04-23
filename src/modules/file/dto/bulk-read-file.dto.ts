import { IsArray } from 'class-validator';

export class BulkReadFileDTO {
  @IsArray()
  uuids: [];
}
