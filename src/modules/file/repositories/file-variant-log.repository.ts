import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { FileVariantLogDAO } from '../dao/file-variant-log.dao';
import { FileVariantLog } from '../entities/file-variant-log.entity';

@EntityRepository(FileVariantLog)
export class FileVariantLogRepository extends Repository<FileVariantLog> {
  /**
   * Creates new record
   */
  async store(data: FileVariantLogDAO): Promise<FileVariantLog> {
    return await this.save(data);
  }
}
