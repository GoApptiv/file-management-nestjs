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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ValidationError } from 'class-validator';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { AppConfigModule } from './config/config.module';

async function bootstrap(): Promise<any> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // Configure logger
  app.useLogger(app.get(Logger));

  // Add global prefix in uri
  app.setGlobalPrefix('api');

  // Enable versioning example https://filestorage.com/v1/route
  app.enableVersioning();

  // Transforms validation error to generalised format
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (
        validationErrors: ValidationError[] = [],
      ): BadRequestException => {
        return new BadRequestException(
          GaRestResponse.transformValidationError(validationErrors),
        );
      },
    }),
  );

  const eventEmitter = app.get(EventEmitter2);

  // Add exception filters
  app.useGlobalFilters(
    new AllExceptionsFilter(eventEmitter),
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
void bootstrap();
