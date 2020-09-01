import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { Player } from '../players/interfaces/player.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) { }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getUser(email: string): Promise<User> {
    return await this.userModel
      .findOne({ email })
      .exec();
  }

  async addUser(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = await this.userModel(createUserDTO);
    return await newUser.save();
  }

  async editUser(userID, newUser): Promise<User> {
    return await this.userModel
      .findByIdAndUpdate(userID, newUser, { new: true });
  }

  async getUserEventsCount(userId: string): Promise<number> {
    const eventsCount = await this.playerModel.find({ userId });
    return eventsCount.length;
  }

  async deleteUser(userID): Promise<any> {
    return await this.userModel
      .findByIdAndRemove(userID);
  }
}
