import { Module } from '@nestjs/common';
import { VoiceController } from './modules/voice/voice.controller';
import { VoiceService } from './modules/voice/voice.service';
import { TencentVoiceRecognitionAdapter } from './modules/voice/adapter/TencentVoiceRecognitionAdapter';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('MONGO_URI'),
          user: configService.get<string>('MONGO_USER'),
          pass: configService.get<string>('MONGO_PASS'),
        };
      },
    }),
  ],
  controllers: [VoiceController],
  providers: [VoiceService, TencentVoiceRecognitionAdapter],
})
export class AppModule {}
