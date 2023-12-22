import { EggLogger } from 'egg';
import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import * as tencentCloudSdk from 'tencentcloud-sdk-nodejs-asr'; // typescript中要这样子引入
import { Client } from "tencentcloud-sdk-nodejs-asr/tencentcloud/services/asr/v20190614/asr_client";
import { TaskStatus } from "tencentcloud-sdk-nodejs-asr/tencentcloud/services/asr/v20190614/asr_models";

@SingletonProto({
  // 如果需要在上层使用，需要把 accessLevel 显示声明为 public
  accessLevel: AccessLevel.PUBLIC,
})
export class TencentService {
  // 注入一个 logger
  @Inject()
  logger: EggLogger;

  asrClient: Client;

  constructor() {
    const clientConfig = {
      credential: {
        secretId: "",
        secretKey: "",
      },
      region: "",
      profile: {
        httpProfile: {
          endpoint: "asr.tencentcloudapi.com",
        },
      },
    };
    this.asrClient = new tencentCloudSdk.asr.v20190614.Client(clientConfig);
  }

  async uploadAudioFile(audioData: string): Promise<number|undefined> {
    this.logger.info(audioData)
    const params = {
      "EngineModelType": "16k_zh-PY", // 三种语言
      "ChannelNum": 1, // 单声道
      "ResTextFormat": 0, //
      "SourceType": 1,
      "Data": audioData, // 音频Base64数据
    }
    const res = await this.asrClient.CreateRecTask(params);
    if (res.Data) {
      return res.Data.TaskId;
    } else {
      return undefined;
    }
  }

  async checkAudioStatus(taskId: number): Promise<TaskStatus|undefined> {
    this.logger.info(taskId)
    const res = await this.asrClient.DescribeTaskStatus({
      "TaskId": taskId,
    });
    this.logger.info(res)
    if (res.Data) {
      return res.Data
    }
  }
}
