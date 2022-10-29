import { Injectable } from '@nestjs/common';
import { DataSource, getConnection, InsertResult, Repository } from 'typeorm';
import { StoreAccessLogDAO } from '../dao/access-log.dao';
import { AccessLog } from '../entities/access-log.entity';

@Injectable()
export class AccessLogRepository extends Repository<AccessLog> {
  constructor(dataSource: DataSource) {
    super(AccessLog, dataSource.manager);
  }

  /**
   * Creates new record
   */
  async store(data: StoreAccessLogDAO): Promise<AccessLog> {
    return await this.save(data);
  }

  async bulkStore(data: StoreAccessLogDAO[]): Promise<InsertResult> {
    return await getConnection()
      .createQueryBuilder()
      .insert()
      .into(AccessLog)
      .values(data)
      .execute();
  }
}
