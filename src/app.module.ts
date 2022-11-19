import { Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'pino-stackdriver';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './config/app-config.service';
import { AppConfigModule } from './config/config.module';
import { FileModule } from './modules/file/file.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SlackModule } from 'nestjs-slack';
import { SlackHelperModule } from '@goapptiv/slack-helper-nestjs';
import { SlackChannel } from './shared/constants/slack-channel.enum';

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
    SlackModule.forRootAsync({
      isGlobal: true,
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        type: 'webhook',
        channels: [
          {
            name: SlackChannel.EXCEPTION,
            url: appConfigService.slackExceptionNotifierWebhook,
          },
        ],
        defaultChannel: SlackChannel.EXCEPTION,
      }),
      inject: [AppConfigService],
    }),
    SlackHelperModule.registerAsync({
      isGlobal: true,
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        appEnv: appConfigService.appEnvironment,
        channels: {
          default: SlackChannel.GENERAL,
          general: SlackChannel.GENERAL,
          exceptions: SlackChannel.EXCEPTION,
        },
      }),
      inject: [AppConfigService],
    }),
    LoggerModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => {
        const logName = `${configService.gcpCredentials.logName}-${configService.appEnvironment}`;

        const writeStream = createWriteStream({
          credentials: {
            client_email: configService.gcpCredentials.logging.email,
            private_key: configService.gcpCredentials.logging.privateKey,
          },
          projectId: configService.gcpCredentials.projectId,
          logName: logName,
          resource: {
            type: 'global',
          },
        });

        return {
          pinoHttp: {
            name: logName,
            stream: writeStream,
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
        };
      },
      inject: [AppConfigService],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
