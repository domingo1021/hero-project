import { Module } from '@nestjs/common';

import { AppController } from '#src/modules/app/app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule {}
