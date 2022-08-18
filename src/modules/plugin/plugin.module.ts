import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginController as PluginControllerV2 } from './controllers/v2/plugin.controller';
import { RegisterPluginStatusSubscriberListener } from './listeners/project-plugin-registered.listener';
import { PluginRepository } from './repositories/plugin.repository';
import { PluginService } from './services/plugin.service';

@Module({
  imports: [TypeOrmModule.forFeature([PluginRepository])],
  controllers: [PluginControllerV2],
  providers: [PluginService, RegisterPluginStatusSubscriberListener],
})
export class PluginModule {}
