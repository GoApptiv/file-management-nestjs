import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginController as PluginControllerV2 } from './controllers/v2/plugin.controller';
import { Plugin } from './entities/plugin.entity';
import { PluginRepository } from './repositories/plugin.repository';
import { PluginService } from './services/plugin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plugin])],
  controllers: [PluginControllerV2],
  providers: [PluginService, PluginRepository],
})
export class PluginModule {}
