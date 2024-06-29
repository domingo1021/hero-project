import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { InternalRequest } from '#cores/types';

export const User = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<InternalRequest>();
    return key ? request.user[key] : request.user;
  },
);
