import { Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/app-config.service';
import { AppConfigModule } from './config/config.module';
import { FileModule } from './modules/file/file.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    FileModule,
    AuthModule,
    AppConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) =>
        configService.typeOrmConfig,
      inject: [AppConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        pinoHttp: {
          stream: pino.destination({
            dest: `logs/${new Date().getFullYear()}/${
              new Date().getMonth() + 1
            }/${new Date().getFullYear()}-${
              new Date().getMonth() + 1
            }-${new Date().getDate()}.log`,
            minLength: 4096,
            sync: false,
            mkdir: true,
          }),
          redact: ['req.headers.authorization'],
          genReqId: () => uuidv4(),
          transport: !configService.isProduction
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  translateTime: 'yyyy-MM-dd HH:mm:ss',
                  messageFormat: '{req.id} [{context}] {msg}',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
        },
      }),
      inject: [AppConfigService],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
