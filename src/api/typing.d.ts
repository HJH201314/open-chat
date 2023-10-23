declare namespace API {
  /* 只返回status */
  interface StatusResult {
    status: number;
  }
  /* 返回data */
  interface DataResult<T> {
    status: number;
    data: T;
  }

  type LoginResult = {
    userId?: number;
  }
}