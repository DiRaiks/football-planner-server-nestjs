import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Player } from './interfaces/player.interface';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { EventsService } from '../events/events.service';
import { calcAllPlayers } from '../utils';
import { sortBy } from 'lodash';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
    private readonly eventsService: EventsService,
  ) {}

  async getPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async savePlayer(createPlayerDTO: CreatePlayerDTO): Promise<object> {
    await this.playerModel(createPlayerDTO).save();
    const players = await this.playerModel.find().exec();
    const playersAmount = calcAllPlayers(players);
    const sortedPlayers = sortBy(players, (item) => {
      return !item.status;
    });

    const changedEvent = await this.eventsService
      .editEventField(createPlayerDTO.eventId, 'playersAmount', playersAmount);

    return { players: sortedPlayers, event: changedEvent };
  }

  async deletePlayer(playerID: string): Promise<any> {
    const deletedPlayer = await this.playerModel
      .findByIdAndRemove(playerID);
    const players = await this.playerModel.find().exec();
    const playersAmount = calcAllPlayers(players);
    const sortedPlayers = sortBy(players, (item) => {
      return !item.status;
    });

    const changedEvent = await this.eventsService
      .editEventField(deletedPlayer.eventId, 'playersAmount', playersAmount);

    return { deletedPlayer, players: sortedPlayers, event: changedEvent };
  }

  async editPlayer(playerID: string, createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return await this.playerModel
      .findByIdAndUpdate(playerID, createPlayerDTO, { new: true });
  }

  async getPlayersByEventId(eventID: string): Promise<Player> {
    return await this.playerModel
      .find({ eventId: eventID })
      .exec();
  }
}
