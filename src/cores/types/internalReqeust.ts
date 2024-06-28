import { Request } from 'express';

export interface InternalRequest extends Request {
  locals: {
    [key: string]: any;
    requestId: string;
  };
}

declare module 'express' {
  export interface Request {
    locals?: {
      [key: string]: any;
      requestId?: string;
    };
  }
}
