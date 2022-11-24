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

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // configure logger
  app.useLogger(app.get(Logger));

  // add global prefix in uri
  app.setGlobalPrefix('api');

  // enable versioning example https://filestorage.com/v1/route
  app.enableVersioning();

  // transforms validation error to generalised format
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          GaRestResponse.transformValidationError(validationErrors),
        );
      },
    }),
  );

  const eventEmitter = app.get(EventEmitter2);

  // add exception filters
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
bootstrap();
