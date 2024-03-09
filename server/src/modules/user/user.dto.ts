import { IsIn } from 'class-validator';

export class UserAuthDto {
  /**
   * the user's name
   * @example admin
   */
  username: string;
  /**
   * the user's password or other credentials
   * @example 123456
   */
  credential: string;
  /**
   * user's credentials type (password, openid, etc.)
   * @example password
   */
  @IsIn(['password'], {
    message: 'Unsupported auth type.',
  })
  type: string;
}
