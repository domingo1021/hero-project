import { Global, Injectable } from '@nestjs/common';
import { BaseLog } from './type/baseLog';

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
