import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GcpCredentialsOptions } from 'src/shared/interfaces/gcp-credentials-options.interface';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  private getNumber(key: string, defaultValue?: number): number {
    const value = this.configService.get(key, defaultValue);
    if (!value) {
      throw new Error(key + ' env var not set');
    }
    try {
      return Number(value);
    } catch {
      throw new Error(key + ' env var is not a number');
    }
  }

  private getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.configService.get(key, defaultValue?.toString());
    if (!value) {
      throw new Error(key + ' env var not set');
    }
    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string, defaultValue?: string): string {
    const value = this.configService.get(key, defaultValue);

    if (!value) {
      console.warn(`"${key}" environment variable is not set`);
      return;
    }
    return value.toString().replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV', 'development');
  }

  get appConfig() {
    return {
      name: this.getString('APP_NAME'),
      description: this.getString('APP_DESCRIPTION'),
      maintainer: this.getString('APP_MAINTAINER'),
      url: this.getString('APP_URL'),
      supportEmail: this.getString('APP_SUPPORT_EMAIL'),
      port: this.getString('APP_PORT'),
    };
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      autoLoadEntities: true,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get jwtSecret(): string {
    return this.getString('JWT_TOKEN_SECRET');
  }

  get gcpCredentials(): GcpCredentialsOptions {
    return {
      projectId: this.getString('GCP_PROJECT_ID'),
      pubSub: {
        email: this.getString('GCP_PUBSUB_EMAIL'),
        privateKey: this.getString('GCP_PUBSUB_KEY'),
      },
    };
  }
}
