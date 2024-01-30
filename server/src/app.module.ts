import { Module } from '@nestjs/common';
import { VoiceController } from './voice/voice.controller';
import { VoiceService } from './voice/voice.service';
import { TencentVoiceRecognitionAdapter } from './voice/adapter/TencentVoiceRecognitionAdapter';

@Module({
  imports: [],
  controllers: [VoiceController],
  providers: [VoiceService, TencentVoiceRecognitionAdapter],
})
export class AppModule {}
