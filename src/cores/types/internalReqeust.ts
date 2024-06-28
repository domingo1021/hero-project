import { Request } from 'express';

export interface LocalUser {
  isAuthenticated: boolean;
}

/**
 * Nest official doesn't recommend to use res.locals, use req.locals instead.
 *
 * Reference: https://github.com/nestjs/nest/issues/913
 */
export interface InternalRequest extends Request {
  locals: {
    [key: string]: any;
    requestId: string;
  };
  user: LocalUser;
}

declare module 'express' {
  export interface Request {
    locals?: {
      [key: string]: any;
      requestId?: string;
    };
  }
}
