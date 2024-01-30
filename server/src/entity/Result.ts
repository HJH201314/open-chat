export class CommonResult<T> {
  data: T;
  status: number;
  message: string;

  constructor(data: T, status: number = 200, message: string = 'ok') {
    this.data = data;
    this.status = status;
    this.message = message;
  }
}

export class ListResult<T> {
  list: T[];
  total: number;
}
