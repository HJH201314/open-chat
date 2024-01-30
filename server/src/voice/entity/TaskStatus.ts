export type TaskStatus = {
  /**
   * 任务标识
   */
  taskId?: string;
  /**
   * 任务状态码，0：任务等待，1：任务执行中，2：任务成功，3：任务失败。
   */
  status?: number;
  /**
   * 任务状态，waiting：任务等待，doing：任务执行中，success：任务成功，failed：任务失败。
   */
  statusStr?: string;
  /**
   * 识别结果。
   */
  result?: string;
  /**
   * 失败原因说明。
   */
  errorMsg?: string;
  /**
   * 识别原始结果
   */
  resultOrigin?: string;
  /**
   * 音频时长(秒), -1为非有效值。
   */
  audioDuration?: number;
};
