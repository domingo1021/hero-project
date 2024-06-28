import { Controller, Get, All, NotFoundException } from '@nestjs/common';

import { CustomErrorCodes } from '#cores/types';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  healthCheck(): string {
    return 'OK';
  }

  @All('*')
  notFoundHandler(): void {
    const NOT_FOUND_MSG = 'Resource not found';

    throw new NotFoundException({
      code: CustomErrorCodes.NOT_FOUND,
      message: NOT_FOUND_MSG,
    });
  }
}
