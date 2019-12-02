import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './interfaces/event.interface';
import { CreateEventDTO } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private readonly eventModel: Model<Event>) {}

  async getEvents(): Promise<Event[]> {
    return await this.eventModel.find().exec();
  }

  async saveEvent(createEventDTO: CreateEventDTO): Promise<Event[]> {
    await this.eventModel(createEventDTO).save();
    return await this.eventModel.find().exec();
  }

  async deleteEvent(eventID: string): Promise<any> {
    const deletedEvent = await this.eventModel
      .findByIdAndRemove(eventID);
    const events = await this.eventModel.find().exec();
    return { deletedEvent, events };
  }

  async getEvent(eventID: string): Promise<Event> {
    return await this.eventModel
      .findById(eventID)
      .exec();
  }

  async editEvent(eventID, createEventDTO: CreateEventDTO): Promise<Event> {
    return await this.eventModel
      .findByIdAndUpdate(eventID, createEventDTO, { new: true }).exec();
  }

  async editEventField(eventID, field, value): Promise<Event> {
    return await this.eventModel
      .findByIdAndUpdate(eventID, { [field]: value }, { new: true }).exec();
  }
}
