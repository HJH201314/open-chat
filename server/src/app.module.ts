import { Module } from '@nestjs/common';
import { VoiceController } from './modules/voice/voice.controller';
import { VoiceService } from './modules/voice/voice.service';
import { TencentVoiceRecognitionAdapter } from './modules/voice/adapter/TencentVoiceRecognitionAdapter';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@/modules/user/user.module';
import { MONGO_CONFIG } from '@/config/database';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(MONGO_CONFIG.uri, MONGO_CONFIG.config),
  ],
  controllers: [VoiceController],
  providers: [VoiceService, TencentVoiceRecognitionAdapter],
})
export class AppModule {}
