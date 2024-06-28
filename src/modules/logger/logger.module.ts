import { Module, Provider } from '@nestjs/common';
import * as winston from 'winston';

import { CustomLog } from './appLog.service';
import { WinstonConfig } from './logger.config';

const WinstonProvider: Provider = {
  provide: 'Winston',
  useValue: winston.createLogger(WinstonConfig),
};

@Module({
  providers: [CustomLog, WinstonProvider],
  exports: [CustomLog],
})
export class LoggerModule {}

// RequestId workaround: https://gist.github.com/bengry/924a9b93c25d8a98bffdfc0a847f0dbe
// res.locals --> workaround with req.locals.requestId https://github.com/nestjs/nest/issues/913
