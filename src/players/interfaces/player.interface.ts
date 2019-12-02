import { Document } from 'mongoose';
import { Friend } from './friend.interface';

export interface Player extends Document {
  readonly friends: Friend[];
  readonly name: string;
  readonly date: string;
  readonly status: boolean;
  readonly eventId: string;
  readonly userId: number;
}
