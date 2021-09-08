import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BucketConfig } from './entities/bucket-config.entity';
import { ProjectRepository } from './repositories/project.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository, BucketConfig])],
})
export class AuthModule {}
