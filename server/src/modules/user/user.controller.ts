import { Body, Controller, HttpStatus, Injectable, Post } from '@nestjs/common';
import { UserAuthDto } from './user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserCredential } from '@/modules/user/user.schema';
import { AssertsUtils } from '@/utils/asserts.utils';
import { CommonResult } from '@/entity/Result';
import { UserService } from '@/modules/user/user.service';

@ApiTags('User')
@Controller('user')
@Injectable()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login-center')
  async login(@Body() userLoginDto: UserAuthDto) {
    const user = await this.userService.findUserByName(userLoginDto.username);
    AssertsUtils.notNull(user, 'user not exists', HttpStatus.NOT_FOUND);

    return user.credential.some((v) => {
      if (v.type === userLoginDto.type) {
        return userLoginDto.credential == v.credential;
      }
    });
  }

  @Post('register-center')
  async register(@Body() userRegisterDto: UserAuthDto) {
    // check if username exists
    const oldUser = await this.userService.findUserByName(
      userRegisterDto.username,
    );
    AssertsUtils.isNull(oldUser, 'user already exists', HttpStatus.CONFLICT);

    // save user info
    await this.userService.insert({
      username: userRegisterDto.username,
      credential: [
        new UserCredential(userRegisterDto.credential, userRegisterDto.type),
      ],
    });
    return CommonResult.success(true);
  }
}
