import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/app-config.service';
import { AppConfigModule } from 'src/config/config.module';
import { CloudPubSubService } from 'src/shared/services/cloud-pubsub.service';
import { Plugin } from '../file/entities/plugin.entity';
import { ProjectPlugin } from '../file/entities/project-plugin.entity';
import { RegisterPluginStatusSubscriberListener } from '../file/listeners/project-plugin-registered.listener';
import { PluginRepository } from '../file/repositories/plugin.repository';
import { ProjectPluginRepository } from '../file/repositories/project-plugin.repository';
import { ProjectController as ProjectControllerV2 } from './controllers/v2/project.controller';
import { BucketConfig } from './entities/bucket-config.entity';
import { Project } from './entities/project.entity';
import { BucketConfigRepository } from './repositories/bucket-config.repository';
import { ProjectRepository } from './repositories/project.repository';
import { AuthService } from './services/auth.service';
import { ProjectService } from './services/project.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([BucketConfig, Plugin, ProjectPlugin, Project]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => {
        return { secret: configService.jwtSecret };
      },
      inject: [AppConfigService],
    }),
  ],
  controllers: [ProjectControllerV2],
  providers: [
    AuthService,
    ProjectService,
    {
      provide: CloudPubSubService,
      useFactory: (configService: AppConfigService) => {
        return new CloudPubSubService(
          configService.gcpCredentials.pubSub.email,
          configService.gcpCredentials.pubSub.privateKey,
          configService.gcpCredentials.projectId,
        );
      },
      inject: [AppConfigService],
    },
    RegisterPluginStatusSubscriberListener,
    JwtStrategy,
    ProjectRepository,
    ProjectPluginRepository,
    PluginRepository,
    BucketConfigRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
