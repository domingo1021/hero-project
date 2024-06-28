import { NestFactory } from '@nestjs/core';

import { AppModule } from '#app/app.module';
import { SystemLog } from '#logger/systemLog.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new SystemLog(),
  });
  await app.listen(3000);
}
bootstrap();
