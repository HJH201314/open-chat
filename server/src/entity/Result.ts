import { HttpStatus } from '@nestjs/common';

export class CommonResult<T> {
  data: T;
  status: number;
  message: string;

  constructor(data: T, message: string = 'ok', status: HttpStatus = 200) {
    this.data = data;
    this.status = status;
    this.message = message;
  }

  static success<T>(data: T, message: string = 'ok') {
    return new CommonResult(data, message, HttpStatus.OK);
  }

  static error<T>(
    data: T,
    message: string = 'error',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new CommonResult(data, message, status);
  }
}

export class ListResult<T> {
  list: T[];
  total: number;
}
