import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';

import { Response } from 'express';

import { InternalRequest, CustomErrorCodes, ErrorResponse } from '#cores/types';
import { CustomLog } from '#logger/appLog.service';

/**
 * @description AllExceptionsFilter is a filter to catch all exceptions and return a proper response.
 * If error response interface is not determined, it will treat it as Internal Server Error.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLog) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: InternalRequest = ctx.getRequest<InternalRequest>();
    const response: Response = ctx.getResponse<Response>();
    const requestId: string = request.locals.requestId;

    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorResponse = {
      code: CustomErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      requestId,
    };

    if (exception instanceof BadRequestException) {
      const customException = exception.getResponse() as ErrorResponse;
      const message = Array.isArray(customException.message)
        ? customException.message.join(', ')
        : customException.message;
      statusCode = exception.getStatus();
      errorResponse = {
        message,
        code: CustomErrorCodes.BAD_REQUEST,
        requestId,
      };
    } else if (exception instanceof HttpException) {
      const customException = exception.getResponse() as ErrorResponse;
      statusCode = exception.getStatus();
      errorResponse = {
        ...customException,
        requestId,
      };
    }

    this.logger.info(
      requestId,
      `Response, ${statusCode}, ${request.url}, ${JSON.stringify(response.getHeaders())}, Error: ${JSON.stringify(
        errorResponse,
      )}`,
    );

    response.status(statusCode).json(errorResponse);
  }
}
