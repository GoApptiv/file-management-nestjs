import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BucketConfig } from '../entities/bucket-config.entity';

@Injectable()
export class BucketConfigRepository extends Repository<BucketConfig> {
  constructor(dataSource: DataSource) {
    super(BucketConfig, dataSource.manager);
  }
}
