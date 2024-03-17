import { IsIn } from 'class-validator';

export class UserAuthDto {
  /**
   * 用户名
   * @example admin
   */
  username: string;
  /**
   * 用户凭据
   * @example 123456
   */
  credential: string;
  /**
   * 用户凭据类型 (password, openid, etc.)
   * @example password
   */
  @IsIn(['password'], {
    message: 'Unsupported auth type.',
  })
  type: string;
}
