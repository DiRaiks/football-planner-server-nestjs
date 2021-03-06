import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Player } from './interfaces/player.interface';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { EventsService } from '../events/events.service';
import { calcAllPlayers } from '../utils';
import { sortBy } from 'lodash';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
    private readonly eventsService: EventsService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  async getPlayers(): Promise<Player[]> {
    const players = await this.playerModel.find().exec();
    return sortBy(players, (item) => {
      return !item.status;
    });
  }

  async savePlayer(createPlayerDTO: CreatePlayerDTO): Promise<object> {
    await this.playerModel(createPlayerDTO).save();
    const players = await this.playerModel
      .find({ eventId: createPlayerDTO.eventId }).exec();
    const { all: playersAmount, exactly, maybe } = calcAllPlayers(players);
    const sortedPlayers = sortBy(players, (item) => {
      return !item.status;
    });

    const changedEvent = await this.eventsService
      .editEventField(createPlayerDTO.eventId, 'playersAmount', playersAmount);

    await this.telegramBotService.sendAddPlayerMessage(createPlayerDTO, changedEvent, exactly, maybe);

    return { players: sortedPlayers, event: changedEvent };
  }

  async deletePlayer(playerID: string): Promise<any> {
    const deletedPlayer = await this.playerModel
      .findByIdAndRemove(playerID);
    const players = await this.playerModel
      .find({ eventId: deletedPlayer.eventId }).exec();
    const { all: playersAmount, exactly, maybe } = calcAllPlayers(players);
    const sortedPlayers = sortBy(players, (item) => {
      return !item.status;
    });

    const changedEvent = await this.eventsService
      .editEventField(deletedPlayer.eventId, 'playersAmount', playersAmount);

    this.telegramBotService.sendDelPlayerMessage(deletedPlayer, changedEvent, exactly, maybe);

    return { deletedPlayer, players: sortedPlayers, event: changedEvent };
  }

  async editPlayer(playerID: string, createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const changedPlayer = await this.playerModel
      .findByIdAndUpdate(playerID, createPlayerDTO, { new: true });
    const players = await this.playerModel
      .find({ eventId: createPlayerDTO.eventId }).exec();
    const { all: playersAmount, exactly, maybe } = calcAllPlayers(players);

    const changedEvent = await this.eventsService
      .editEventField(createPlayerDTO.eventId, 'playersAmount', playersAmount);

    this.telegramBotService.sendEditPlayerMessage(changedPlayer, changedEvent, exactly, maybe);

    return changedPlayer;
  }

  async getPlayersByEventId(eventID: string): Promise<Player[]> {
    const players = await this.playerModel
      .find({ eventId: eventID })
      .exec();
    return sortBy(players, (item) => {
      return !item.status;
    });
  }
}
