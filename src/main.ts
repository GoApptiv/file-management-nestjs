import {
  AllExceptionsFilter,
  BadRequestExceptionFilter,
  ConflictExceptionsFilter,
  ForbiddenExceptionFilter,
  InternalServerErrorExceptionsFilter,
  NotFoundExceptionFilter,
  UnauthorizedExceptionFilter,
} from '@goapptiv/exception-handler-nestjs';
import { GaRestResponse } from '@goapptiv/rest-response-nestjs';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import helmet from 'helmet';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { AppConfigModule } from './config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.File({
          dirname: `logs/${new Date().getFullYear()}/${
            new Date().getMonth() + 1
          }`,
          filename: `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }-${new Date().getDate()}.log`,
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
  });

  // add global prefix in uri
  app.setGlobalPrefix('api');

  // enable versioning example https://filestorage.com/v1/route
  app.enableVersioning();

  // transforms validation error to generalised format
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          GaRestResponse.transformValidationError(validationErrors),
        );
      },
    }),
  );

  // add exception filters
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new UnauthorizedExceptionFilter(),
    new ForbiddenExceptionFilter(),
    new BadRequestExceptionFilter(),
    new NotFoundExceptionFilter(),
    new ConflictExceptionsFilter(),
    new InternalServerErrorExceptionsFilter(),
  );

  app.use(helmet());

  const configService = app.select(AppConfigModule).get(AppConfigService);

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`Server running on port ${port}`);

  return app;
}
bootstrap();
