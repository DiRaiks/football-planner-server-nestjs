import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema({
  friends: Array,
  name: String,
  date: String,
  status: Boolean,
  eventId: String,
  userId: String,
});
