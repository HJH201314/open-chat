import { HttpException, HttpStatus } from '@nestjs/common';

export class AssertsUtils {
  static isTrue(value: boolean, message?: string, status?: HttpStatus) {
    if (value) return;
    throw new HttpException(message ?? '', status ?? HttpStatus.BAD_REQUEST);
  }

  static isIn<T>(values: T[], value: T, message?: string, status?: HttpStatus) {
    this.isTrue(values.includes(value), message, status);
  }

  static notIn<T>(
    values: T[],
    value: T,
    message?: string,
    status?: HttpStatus,
  ) {
    this.isTrue(values.includes(value), message, status);
  }

  static isNull(value?: any, message?: string, status?: HttpStatus) {
    this.isTrue(value === undefined || value === null, message, status);
  }

  static notNull(value?: any, message?: string, status?: HttpStatus) {
    this.isTrue(value !== undefined && value !== null, message, status);
  }
}
