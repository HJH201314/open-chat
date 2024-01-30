import { Injectable } from '@nestjs/common';
import { TencentVoiceRecognitionAdapter } from './adapter/TencentVoiceRecognitionAdapter';

@Injectable()
export class VoiceService {
  constructor(
    private readonly tencentVoiceService: TencentVoiceRecognitionAdapter,
  ) {}

  async uploadAudioFile(fileData: string) {
    return await this.tencentVoiceService.uploadVoiceFileAsync(fileData);
  }

  async queryTaskResult(taskId: string) {
    return await this.tencentVoiceService.getVoiceResult(taskId);
  }
}
