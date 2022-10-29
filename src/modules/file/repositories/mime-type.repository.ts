import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MimeType } from '../entities/mime-type.entity';

@Injectable()
export class MimeTypeRepository extends Repository<MimeType> {
  constructor(dataSource: DataSource) {
    super(MimeType, dataSource.manager);
  }

  /**
   * Finds entity which matches the type
   */
  async findByType(
    type: string,
    relations?: (keyof MimeType)[] | string[],
  ): Promise<MimeType> {
    return await this.findOne({ where: { type }, relations: relations });
  }
}
