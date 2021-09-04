import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { AppConfigModule } from './config/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const configService = app.select(AppConfigModule).get(AppConfigService);

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`Server running on port ${port}`);

  return app;
}
bootstrap();
