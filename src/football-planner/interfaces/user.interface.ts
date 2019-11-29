import { Document } from 'mongoose';

export interface User extends Document {
  readonly email: string;
  readonly name: string;
  readonly hash: string;
  readonly salt: string;
}
