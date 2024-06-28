import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

import { InternalRequest } from '#cores/types';
import { CustomLog } from '#logger/appLog.service';

/**
 * @description LogInterceptor is a interceptor to help track request and response logs.
 * If endpoint is blacklisted, take k8s health check endpoint for example, it will not log the request and response.
 */
@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly blacklist: Array<string> = ['/health', '/metrics'];

  constructor(private readonly logger: CustomLog) {}

  private isBlacklisted(url: string): boolean {
    return this.blacklist.some((blacklistedUrl) =>
      url.includes(blacklistedUrl),
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: InternalRequest = context.switchToHttp().getRequest();
    const requestId: string = request.locals.requestId;
    const { method, url } = request;

    // early return if endpoint is blacklisted
    if (this.isBlacklisted(url)) return next.handle();

    this.logger.log(
      requestId,
      `Request, ${method}, ${url}, ${JSON.stringify(
        request.headers,
      )}, ${JSON.stringify(request.body)}`,
    );

    return next.handle().pipe(
      tap((data) => {
        const response: Response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        this.logger.log(
          requestId,
          `Response, ${statusCode}, ${url}, ${JSON.stringify(
            response.getHeaders(),
          )}, ${JSON.stringify(data)}`,
        );
      }),
    );
  }
}
