import { NestFactory } from '@nestjs/core';

import * as config from 'config';

import { AppModule } from '#app/app.module';
import { SystemLog } from '#logger/systemLog.service';

async function bootstrap() {
  const APP_PORT = +config.get<string>('APP_PORT') || 3000;

  const app = await NestFactory.create(AppModule, {
    logger: new SystemLog(),
  });
  await app.listen(APP_PORT);
}
bootstrap();
