import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Catch and resolve all exception
 */
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const responseBody = {
      status: httpStatus,
      message: exception.message ?? '',
      data: `path: ${request.url}`,
    };

    response.status(httpStatus).json(responseBody);
  }
}
