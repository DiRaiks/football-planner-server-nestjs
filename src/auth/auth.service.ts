import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/user.interface';
import { CreateUserDTO } from '../users/dto/create-user.dto';

interface PasswordHash {
  hash: string;
  salt: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  setPassword(password: string): PasswordHash {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return { hash, salt };
  }

  async validatePassword(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(email);
    if (!user) { return null; }
    const hash = pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex');
    if (user.hash === hash) {
      return user;
    } else {
      return null;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, id: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registration(user: any ): Promise<User> {
    const { hash, salt } = this.setPassword(user.password);
    const userItem = { email: user.email, name: user.name, hash, salt };

    const newUser = await this.userModel(userItem);
    return newUser.save();
  }
}
