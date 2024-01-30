import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { TaskStatus } from './entity/TaskStatus';
import { CommonResult } from '../entity/Result';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('upload')
  async upload(@Body('data') fileData: string): Promise<CommonResult<string>> {
    const res = await this.voiceService.uploadAudioFile(fileData);
    return new CommonResult(res);
  }

  @Get('check')
  async query(
    @Query('taskId') taskId: string,
  ): Promise<CommonResult<TaskStatus>> {
    const res = await this.voiceService.queryTaskResult(taskId);
    return new CommonResult(res);
  }
}
