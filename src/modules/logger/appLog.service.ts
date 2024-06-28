import { Global, Injectable } from '@nestjs/common';
import { BaseLog } from './type/baseLog';

/**
 * @description Custom log implement Nest LoggerService, it will log all endpoint related logs.
 *
 * @example 2024-06-28T08:47:06.411Z [info] [26658fd3-5662-4d32-9d44-a3b85f1d2e10] Response, 200, /heroes/1, {"x-powered-by":"Express"}, {"id":"1","name":"Daredevil","image":"http://..."}
 */
@Global()
@Injectable()
export class CustomLog extends BaseLog {
  constructor() {
    super();
  }

  log(requestId: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(...optionalParams);
    this.logger.log('info', formattedLog, { requestId });
  }

  info(requestId: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(...optionalParams);
    this.logger.info(formattedLog, { requestId });
  }

  error(requestId: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(...optionalParams);
    this.logger.error(formattedLog, { requestId });
  }

  warn(requestId: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(...optionalParams);
    this.logger.warn(formattedLog, { requestId });
  }

  debug(requestId: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(...optionalParams);
    this.logger.debug(formattedLog, { requestId });
  }

  verbose(requestId: string, ...optionalParams: any[]): any {
    const formattedLog: string = this.formatParams(...optionalParams);
    this.logger.verbose(formattedLog, { requestId });
  }
}
