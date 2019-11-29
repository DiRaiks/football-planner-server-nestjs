import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async getUser(email): Promise<User> {
    const user = await this.userModel
      .findOne({ email })
      .exec();
    return user;
  }

  async addUser(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = await this.userModel(createUserDTO);
    return newUser.save();
  }

  async editUser(userID, createUserDTO: CreateUserDTO): Promise<User> {
    const editedUser = await this.userModel
      .findByIdAndUpdate(userID, createUserDTO, { new: true });
    return editedUser;
  }

  async deleteUser(userID): Promise<any> {
    const deletedPost = await this.userModel
      .findByIdAndRemove(userID);
    return deletedPost;
  }
}
