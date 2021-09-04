import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from './repository/project.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository])],
})
export class AuthModule {}
