import { Injectable, NestMiddleware } from '@nestjs/common';

import { Response, NextFunction } from 'express';

import { InternalRequest } from '#cores/types';
import { CustomLog } from '#logger/appLog.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLog) {}

  use(req: InternalRequest, _res: Response, next: NextFunction) {
    const requestId = req.locals.requestId;
    const { method, url, headers, body } = req;

    this.logger.log(requestId, `Request, ${method}, ${url}, ${JSON.stringify(headers)}, ${JSON.stringify(body)}`);

    next();
  }
}
