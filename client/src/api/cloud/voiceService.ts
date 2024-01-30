import { createRequest } from "@/api/cloud/base";

/**
 * 上传录音文件
 * @param file 录音文件base64字符串
 */
export const uploadAudioFileUsingPost = (file: string) => {
  return createRequest<API.AudioTencentUploadResult>('/voice/upload', {
    method: 'POST',
    data: {
      data: file,
    },
  });
}

/**
 * 轮询录音识别结果
 * @param taskId 任务ID
 */
export const checkAudioResultUsingGet = (taskId: API.TaskId) => {
  return createRequest<API.AudioTencentCheckResult>('/voice/check', {
    method: 'GET',
    params: {
      taskId: taskId,
    },
  });
}