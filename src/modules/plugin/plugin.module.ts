import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginController } from './controllers/plugin.controller';
import { PluginRepository } from './repositories/plugin.repository';
import { PluginService } from './services/plugin.service';

@Module({
  imports: [TypeOrmModule.forFeature([PluginRepository])],
  controllers: [PluginController],
  providers: [PluginService],
})
export class PluginModule {}
