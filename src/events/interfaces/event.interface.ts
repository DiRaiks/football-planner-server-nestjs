import { Document } from 'mongoose';

export interface Event extends Document {
  readonly _id: string;
  readonly place: string,
  readonly time: string,
  readonly date: string,
  readonly minimum: number,
  readonly playersAmount: number,
  readonly eventName: string,
  readonly creatorId: string,
}
