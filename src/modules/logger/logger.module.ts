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
