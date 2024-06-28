import {
  ExecutionContext,
  CallHandler,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { InternalRequest } from '../types';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: InternalRequest = context.switchToHttp().getRequest();

    const headerName = 'X-Request-Id';
    const headerId = req.get(headerName);
    const requestId = headerId ? headerId : uuidv4();

    req.locals = req.locals || {};
    req.locals.requestId = requestId;
    return next.handle();
  }
}
