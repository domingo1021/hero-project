import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

/**
 * @description  is a interceptor to help generate request id.
 * It will be place at the beginning of the request and store the request id in the request locals.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const headerName = 'X-Request-Id';
    const headerId = req.get(headerName);
    const requestId = headerId ? headerId : uuidv4();

    req.locals = req.locals || {};
    req.locals.requestId = requestId;
    next();
  }
}
