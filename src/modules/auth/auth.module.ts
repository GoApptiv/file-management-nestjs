import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from 'src/config/app-config.service';
import { AppConfigModule } from 'src/config/config.module';
import { BucketConfig } from './entities/bucket-config.entity';
import { ProjectRepository } from './repositories/project.repository';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectRepository, BucketConfig]),
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
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
