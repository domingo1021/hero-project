import * as winston from 'winston';
import { LoggerService } from '@nestjs/common';
import { BaseLog } from './type/baseLog';

/**
 * @description System log implement Nest LoggerService, it will log all server related system logs.
 *
 * @example 2024-06-28T08:45:20.332Z [info] [SYSTEM_LOG] Nest application successfully started ["NestApplication"]
 */
export class SystemLog extends BaseLog implements LoggerService {
  private readonly requestId: string = 'SYSTEM_LOG';
  protected readonly logger: winston.Logger;

  constructor() {
    super();
  }

  protected formatParams(...params: any[]): string {
    return params
      .map((param) => {
        if (typeof param === 'object') {
          return JSON.stringify(param);
        }
        return param;
      })
      .join(' ');
  }

  log(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, optionalParams);
    this.logger.log('info', formattedLog, { requestId: this.requestId });
  }

  info(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, optionalParams);
    this.logger.info(formattedLog, { requestId: this.requestId });
  }

  error(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, optionalParams);
    this.logger.error(formattedLog, { requestId: this.requestId });
  }

  warn(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, optionalParams);
    this.logger.warn(formattedLog, { requestId: this.requestId });
  }

  debug(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, optionalParams);
    this.logger.debug(formattedLog, { requestId: this.requestId });
  }

  verbose(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, optionalParams);
    this.logger.verbose(formattedLog, { requestId: this.requestId });
  }
}
