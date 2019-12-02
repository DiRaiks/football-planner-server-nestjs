import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
  place: String,
  time: String,
  date: String,
  minimum: Number,
  playersAmount: Number,
  eventName: String,
  creatorId: String,
});
