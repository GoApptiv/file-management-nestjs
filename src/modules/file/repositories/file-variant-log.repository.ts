import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StoreFileVarianLogDAO } from '../dao/file-variant-log.dao';
import { FileVariantLog } from '../entities/file-variant-log.entity';
import { FileVariant } from '../entities/file-variant.entity';

@Injectable()
export class FileVariantLogRepository extends Repository<FileVariantLog> {
  constructor(dataSource: DataSource) {
    super(FileVariant, dataSource.manager);
  }

  /**
   * Creates new record
   */
  async store(data: StoreFileVarianLogDAO): Promise<FileVariantLog> {
    return await this.save(data);
  }
}
