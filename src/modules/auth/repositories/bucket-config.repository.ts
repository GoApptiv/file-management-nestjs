import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { BucketConfig } from '../entities/bucket-config.entity';

@EntityRepository(BucketConfig)
export class BucketConfigRepository extends Repository<BucketConfig> {}
