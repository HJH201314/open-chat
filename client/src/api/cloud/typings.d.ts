declare namespace API {
  interface CommonResult<T> {
    data: T;
    status: number;
    message: number;
  }

  type AudioTencentUploadResult = CommonResult<{
    taskId: number;
  }>

  type AudioTencentCheckResult = CommonResult<{
    status: number; // 0 - 待处理, 1 - 处理中, 2 - 处理完成, 3 - 失败
    statusStr: string;
    audioDuration: number;
    result: string;
    resultDetail: any;
  }>
}