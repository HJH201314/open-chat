export class CommonResult<T> {
  status: number;
  message: string;
  data: T;

  constructor(data: T, status: number, message: string) {
    this.data = data;
    this.status = status;
    this.message = message;
  }

  stringify() {
    return JSON.stringify({
      data: this.data,
      status: this.status,
      message: this.message,
    });
  }

  static success<T>(data: T, status?: number, message?: string) {
    return new CommonResult(data, status ?? 200, message ?? '').stringify();
  }

  static fail(message?: string, status?: number) {
    return new CommonResult(null, status ?? 400, message ?? '').stringify();
  }

}