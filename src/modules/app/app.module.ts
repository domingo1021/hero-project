import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { INTERNAL_APIS } from '#cores/constants';
import { AllExceptionsFilter } from '#cores/exceptions/general.exception';
import { ResponseLoggerInterceptor } from '#cores/interceptors/responseLog.interceptor';
import { RequestIdMiddleware } from '#cores/middlewares/requestId.middleware';
import { RequestLoggerMiddleware } from '#cores/middlewares/requestLog.middleware';
import { AppController } from '#app/app.controller';
import { HeroModule } from '#hero/hero.module';
import { HeroController } from '#hero/hero.controller';
import { CustomLog } from '#logger/appLog.service';
import { LoggerModule } from '#logger/logger.module';

@Module({
  imports: [LoggerModule, HeroModule],
  controllers: [HeroController, AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseLoggerInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    CustomLog,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const excludedRoutes = INTERNAL_APIS.map((url) => ({
      path: url,
      method: RequestMethod.GET,
    }));

    consumer
      .apply(RequestIdMiddleware, RequestLoggerMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes('*');
  }
}
