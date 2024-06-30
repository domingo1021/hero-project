import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

import { INTERNAL_APIS } from '#cores/constants';
import { InternalRequest } from '#cores/types';
import { CustomLog } from '#logger/appLog.service';

/**
 * @description LogInterceptor is a interceptor to help track request and response logs.
 * If endpoint is blacklisted, take k8s health check endpoint for example, it will not log the request and response.
 */
@Injectable()
export class ResponseLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLog) {}

  private isBlacklisted(url: string): boolean {
    return INTERNAL_APIS.some((blacklistedUrl) => url.includes(blacklistedUrl));
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: InternalRequest = context.switchToHttp().getRequest();
    const { url } = request;

    // early return if endpoint is blacklisted
    if (this.isBlacklisted(url)) return next.handle();

    return next.handle().pipe(
      tap((data) => {
        const requestId: string = request.locals.requestId;
        const response: Response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        this.logger.log(
          requestId,
          `Response, ${statusCode}, ${url}, ${JSON.stringify(response.getHeaders())}, ${JSON.stringify(data)}`,
        );
      }),
    );
  }
}
