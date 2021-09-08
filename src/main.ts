import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { AppConfigModule } from './config/config.module';
import { BadRequestExceptionFilter } from './shared/filters/bad-request-exceptions.filter';
import { RestResponseService } from './shared/services/rest-response.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          RestResponseService.transformValidationError(validationErrors),
        );
      },
    }),
  );

  app.use(helmet());

  const configService = app.select(AppConfigModule).get(AppConfigService);

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`Server running on port ${port}`);

  return app;
}
bootstrap();
