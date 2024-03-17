import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '@/constants/role.constants';

/**
 * UserCredential 用户凭证实体类
 * 用户身份信息
 */
@Schema()
export class UserCredential {
  constructor(credential: string, type: string) {
    this.credential = credential;
    this.type = type;
  }
  /**
   * 用户凭证
   */
  @Prop()
  credential: string;
  /**
   * 用户身份类型 (password, openid, etc.)
   */
  @Prop()
  type: string;
}

/**
 * User 用户实体类
 * 用户基本信息
 */
@Schema()
export class User {
  /**
   * 用户名
   */
  @Prop()
  username: string;
  /**
   * 手机号
   */
  @Prop()
  phone?: string;
  /**
   * 邮箱
   */
  @Prop()
  email?: string;
  /**
   * 用户头像
   */
  @Prop()
  avatar?: string;
  /**
   * 用户凭据
   */
  @Prop({
    type: [UserCredential],
  })
  credential?: UserCredential[];
  /**
   * 用户角色
   */
  @Prop({
    type: [Number],
    get: (roleNum: number[]) => roleNum.map((r) => Role.fromId(r)),
    set: (roleClass: Role[]) => roleClass.map((r) => r.getRoleId()),
  })
  role?: Role[];
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
