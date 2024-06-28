import * as winston from 'winston';
import { WinstonConfig } from '../logger.config';

export abstract class BaseLog {
  protected readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger(WinstonConfig);
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
    const formattedLog: string = this.formatParams(message, ...optionalParams);
    this.logger.log('info', formattedLog);
  }

  info(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, ...optionalParams);
    this.logger.info(formattedLog);
  }

  error(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, ...optionalParams);
    this.logger.error(formattedLog);
  }

  warn(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, ...optionalParams);
    this.logger.warn(formattedLog);
  }

  debug(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, ...optionalParams);
    this.logger.debug(formattedLog);
  }

  verbose(message: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(message, ...optionalParams);
    this.logger.verbose(formattedLog);
  }
}
