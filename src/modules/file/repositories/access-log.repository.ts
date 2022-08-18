import { getConnection, InsertResult, Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { StoreAccessLogDAO } from '../dao/access-log.dao';
import { AccessLog } from '../entities/access-log.entity';

@EntityRepository(AccessLog)
export class AccessLogRepository extends Repository<AccessLog> {
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
