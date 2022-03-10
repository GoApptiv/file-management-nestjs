import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { BucketConfig } from '../entities/bucket-config.entity';

@EntityRepository(BucketConfig)
export class BucketConfigRepository extends Repository<BucketConfig> {
  /**
   * Finds entity which matches the project id and type
   */
  async findByProjectId(
    projectId: number,
    relations?: (keyof BucketConfig)[] | string[],
  ): Promise<BucketConfig> {
    return await this.findOne({
      where: { projectId },
      relations: relations,
    });
  }
}
