import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@/modules/user/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUserById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async findUserByName(name: string) {
    return await this.userModel
      .findOne({
        username: name,
      })
      .exec();
  }

  async insert(user: User) {
    return await this.userModel.create(user);
  }
}
