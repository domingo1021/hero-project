import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { InternalRequest } from '#cores/types';

// Reference: https://github.com/nestjs/nest/issues/913#issuecomment-408822021
export const Local = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<InternalRequest>();
    return key ? request.locals[key] : request.locals;
  },
);
