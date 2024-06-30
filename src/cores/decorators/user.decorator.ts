import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { InternalRequest } from '#cores/types';

/**
 * @description Get the user authentication related object from the request object.
 * @param key - The key of the user object to retrieve.
 */
export const User = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<InternalRequest>();
  return key ? request.user[key] : request.user;
});
