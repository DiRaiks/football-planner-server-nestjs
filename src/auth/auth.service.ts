import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/user.interface';
import { CustomError } from '../utils';

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
    const hash = pbkdf2Sync(
      password,
      salt,
      10000,
      512,
      'sha512',
      ).toString('hex');

    return { hash, salt };
  }

  async validatePassword(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUser(email);
    if (!user) { return null; }
    const hash = pbkdf2Sync(
      password, user.salt,
      10000,
      512,
      'sha512',
    ).toString('hex');

    if (user.hash === hash) {
      return user;
    } else {
      return null;
    }
  }

  async login(user: any) {
    const { email, _id, name } = user;
    const payload = { email, id: _id };
    return {
      _id,
      email,
      name,
      token: this.jwtService.sign(payload),
    };
  }

  async registration(user: any ): Promise<any> {
    const { email, name, password } = user;

    if (!email || !name || !password) {
      throw new CustomError({
        name: 'MISSING_PARAMETER',
        message: `${!email ? 'email' : (!password ? 'password' : 'name')} is required`,
      });
    }
    const foundUser = await this.usersService.getUser(email);

    if (foundUser) {
      throw new CustomError({ name: 'EMAIL_ALREADY_EXISTS', message: 'Email already exists' });
    }
    const { hash, salt } = this.setPassword(password);
    const newUser = { email, name, hash, salt };
    const { _id } = await this.usersService.addUser(newUser);
    const payload = { email, id: _id };

    return { email, name, token: this.jwtService.sign(payload) };
  }
}
