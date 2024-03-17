import { Module } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import jwtConstants from '@/constants/jwt.constants';
import { UserModule } from '@/modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@/modules/auth/auth.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // register global guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
