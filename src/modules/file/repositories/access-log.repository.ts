import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { AccessLogDAO } from '../dao/access-log.dao';
import { AccessLog } from '../entities/access-log.entity';

@EntityRepository(AccessLog)
export class AccessLogRepository extends Repository<AccessLog> {
  /**
   * Creates new record
   */
  async store(data: AccessLogDAO): Promise<AccessLog> {
    return await this.save(data);
  }
}
