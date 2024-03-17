import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import cookieConstants from '@/constants/cookie.constants';
import jwtConstants from '@/constants/jwt.constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/modules/auth/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    // if the route method is decorated with Public(), skip this token guard.
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const token = this.getTokenFromCookie(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      req['user'] = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private getTokenFromCookie(request: Request): string | undefined {
    console.dir(request.cookies);
    return request.cookies[cookieConstants.tokenKey];
  }
}
