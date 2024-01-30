import { Injectable } from '@nestjs/common';
import IBaseVoiceRecognitionAdapter from './IBaseVoiceRecognitionAdapter';
import * as TencentCloudSdk from 'tencentcloud-sdk-nodejs-asr';
import { TaskStatus } from '../entity/TaskStatus';

@Injectable()
export class TencentVoiceRecognitionAdapter
  implements IBaseVoiceRecognitionAdapter
{
  private clientConfig = {
    credential: {
      secretId: '',
      secretKey: '',
    },
    region: '',
    profile: {
      httpProfile: {
        endpoint: 'asr.tencentcloudapi.com',
      },
    },
  };

  private asrClient = new TencentCloudSdk.asr.v20190614.Client(
    this.clientConfig,
  );

  async uploadVoiceFileAsync(audioData: string) {
    const params = {
      EngineModelType: '16k_zh-PY', // 三种语言
      ChannelNum: 1, // 单声道
      ResTextFormat: 0, //
      SourceType: 1,
      Data: audioData, // 音频Base64数据
    };
    const res = await this.asrClient.CreateRecTask(params);
    if (res.Data) {
      return res.Data.TaskId.toString();
    } else {
      return '-1';
    }
  }

  async getVoiceResult(taskId: string) {
    const res = await this.asrClient.DescribeTaskStatus({
      TaskId: Number(taskId),
    });
    if (res.Data) {
      return {
        taskId: res.Data.TaskId.toString(),
        status: res.Data.Status,
        statusStr: res.Data.StatusStr,
        result: res.Data.Result,
        errorMsg: res.Data.ErrorMsg,
        resultOrigin: JSON.stringify(res.Data),
        audioDuration: res.Data.AudioDuration ? res.Data.AudioDuration : -1,
      } as TaskStatus;
    } else {
      return {
        taskId,
        status: 0,
        statusStr: 'waiting',
        result: '',
        errorMsg: '',
        audioDuration: -1,
        resultOrigin: '',
      };
    }
  }
}
