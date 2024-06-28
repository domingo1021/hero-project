import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AllExceptionsFilter } from '#cores/exceptions/general.exception';
import { RequestIdInterceptor } from '#cores/interceptors/requestId.interceptor';
import { LogInterceptor } from '#cores/interceptors/responseLog.interceptor';
import { AppController } from '#app/app.controller';
import { HeroModule } from '#hero/hero.module';
import { HeroController } from '#hero/hero.controller';
import { CustomLog } from '#logger/appLog.service';
import { LoggerModule } from '#logger/logger.module';

@Module({
  imports: [LoggerModule, HeroModule],
  controllers: [HeroController, AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LogInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    CustomLog,
  ],
})
export class AppModule {}
