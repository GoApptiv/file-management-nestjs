import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/app-config.service';
import { AppConfigModule } from './config/config.module';
import { FileModule } from './modules/file/file.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PluginModule } from './modules/plugin/plugin.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    FileModule,
    AuthModule,
    AppConfigModule,
    PluginModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) =>
        configService.typeOrmConfig,
      inject: [AppConfigService],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
