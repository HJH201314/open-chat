import {
  Body,
  Controller,
  HttpStatus,
  Injectable,
  Post,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserJwtPayload } from './auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserCredential, UserDocument } from '@/modules/user/user.schema';
import { AssertsUtils } from '@/utils/asserts.utils';
import { CommonResult } from '@/entity/Result';
import { UserService } from '@/modules/user/user.service';
import cookieConstants from '@/constants/cookie.constants';
import { UserAuthDto } from '@/modules/user/user.dto';
import { Public } from '@/modules/auth/auth.decorator';
import { Role } from '@/constants/role.constants';

@ApiTags('Auth')
@Controller('auth')
@Injectable()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login-center')
  async login(
    @Body() userLoginDto: UserAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findUserByName(userLoginDto.username);
    AssertsUtils.notNull(user, 'user not exists', HttpStatus.NOT_FOUND);

    if (
      user.credential.some((v) => {
        if (v.type === userLoginDto.type) {
          return userLoginDto.credential == v.credential;
        }
      })
    ) {
      this.setJwtCookie(response, user);
      return true;
    } else {
      return false;
    }
  }

  @Public()
  @Post('register-center')
  async register(
    @Body() userRegisterDto: UserAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // check if username exists
    const oldUser = await this.userService.findUserByName(
      userRegisterDto.username,
    );
    AssertsUtils.isNull(oldUser, 'user already exists', HttpStatus.CONFLICT);

    // save user info
    const res = await this.userService.insert({
      username: userRegisterDto.username,
      credential: [
        new UserCredential(userRegisterDto.credential, userRegisterDto.type),
      ],
      role: [Role.USER],
    });
    if (res.id) {
      this.setJwtCookie(response, res);
    }
    return CommonResult.success(true);
  }

  /**
   * Sign JWT and put it in cookie
   * @param response
   * @param user
   * @private
   */
  private setJwtCookie(response: Response, user: UserDocument) {
    const payload: UserJwtPayload = {
      userId: user.id,
      userName: user.username,
      userRole: user.role.map((r) => r.getRoleName()),
    };
    response.cookie(cookieConstants.tokenKey, this.jwtService.sign(payload), {
      maxAge: 259200000, // 3 days
      httpOnly: true,
      sameSite: 'strict',
    });
  }
}
