import { Document } from 'mongoose';

export interface Friend extends Document {
  readonly name: string;
  readonly status: boolean;
}
