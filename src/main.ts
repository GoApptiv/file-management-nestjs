import * as basicAuth from 'express-basic-auth';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { AppConfigModule } from './config/config.module';
import { BadRequestExceptionFilter } from './shared/filters/bad-request-exceptions.filter';
import { RestResponse } from './shared/services/rest-response.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // add global prefix in uri
  app.setGlobalPrefix('api');

  // enable versioning example https://filestorage.com/v1/route
  app.enableVersioning();

  // transforms validation error to generalised format
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          RestResponse.transformValidationError(validationErrors),
        );
      },
    }),
  );

  // custom bad request filter to modify to generalise response format
  app.useGlobalFilters(new BadRequestExceptionFilter());

  app.use(helmet());

  const configService = app.select(AppConfigModule).get(AppConfigService);

  // basic auth for swagger docs
  app.use(
    ['/doc', '/doc-json'],
    basicAuth({
      challenge: true,
      users: {
        [configService.swaggerAuth.userName]:
          configService.swaggerAuth.password,
      },
    }),
  );

  // swagger configs
  const config = new DocumentBuilder()
    .setTitle(configService.appConfig.name)
    .setDescription(configService.appConfig.description)
    .setContact(
      configService.appConfig.maintainer,
      configService.appConfig.url,
      configService.appConfig.supportEmail,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`Server running on port ${port}`);

  return app;
}
bootstrap();
