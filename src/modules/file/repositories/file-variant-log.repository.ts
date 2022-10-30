import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StoreFileVarianLogDAO } from '../dao/file-variant-log.dao';
import { FileVariantLog } from '../entities/file-variant-log.entity';

@Injectable()
export class FileVariantLogRepository extends Repository<FileVariantLog> {
  constructor(dataSource: DataSource) {
    super(FileVariantLog, dataSource.manager);
  }

  /**
   * Creates new record
   */
  store(data: StoreFileVarianLogDAO): Promise<FileVariantLog> {
    return this.save(data);
  }
}
