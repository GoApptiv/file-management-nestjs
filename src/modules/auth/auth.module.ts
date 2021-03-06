import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/app-config.service';
import { AppConfigModule } from 'src/config/config.module';
import { CloudPubSubService } from 'src/shared/services/cloud-pubsub.service';
import { ProjectPluginRegisteredListener } from '../plugin/listeners/project-plugin-registered.listener';
import { PluginRepository } from '../plugin/repositories/plugin.repository';
import { ProjectPluginRepository } from '../plugin/repositories/project-plugin.repository';
import { ProjectController as ProjectControllerV2 } from './controllers/v2/project.controller';
import { BucketConfigRepository } from './repositories/bucket-config.repository';
import { ProjectRepository } from './repositories/project.repository';
import { AuthService } from './services/auth.service';
import { ProjectService } from './services/project.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectRepository,
      BucketConfigRepository,
      PluginRepository,
      ProjectPluginRepository,
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_TOKEN_SECRET,
    }),
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
    ProjectPluginRegisteredListener,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
