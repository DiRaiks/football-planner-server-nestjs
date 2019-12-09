import { Injectable } from '@nestjs/common';
import TelegrafBot, { Telegraf, ContextMessageUpdate, session } from 'telegraf';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Stage from 'telegraf/stage';
import * as WizardScene from 'telegraf/scenes/wizard';
import * as Markup from 'telegraf/markup';
import * as Composer from 'telegraf/composer';
import { ConfigService } from '../config/config.service';
import { Player } from '../players/interfaces/player.interface';
import { Event } from '../events/interfaces/event.interface';
import { getActiveEvents, translit } from '../utils';
import * as SocksAgent from 'socks5-https-client/lib/Agent';
import { Chat } from './interfaces/chat.interface';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class TelegramBotService {
  private readonly bot: Telegraf<ContextMessageUpdate>;
  private chatIds: number[] = [];
  private WizardScene: any;
  private Stage: any;
  private readonly isDevelopment: boolean;

  constructor(
    config: ConfigService,
    @InjectModel('Player') private readonly playerModel: Model<Player>,
    @InjectModel('Event') private readonly eventModel: Model<Event>,
    @InjectModel('Chat') private readonly chatModel: Model<Chat>,
  ) {
    this.isDevelopment = config.isDevelopment;
    const botToken = config.botToken;
    this.bot = this.initBot(botToken);
    this.WizardScene = require('telegraf/scenes/wizard');
    this.Stage = require('telegraf/stage');
  }

  private initBot(token: string) {
    let bot;
    if (this.isDevelopment) {
      const socksAgent = new SocksAgent({
        socksHost: '192.169.249.15',
        socksPort: '61348',
      });
      bot = new TelegrafBot(token, {
        telegram: {
          agent: socksAgent,
        },
      });
    } else {
      bot = new TelegrafBot(token);
    }

    bot.start((ctx: any) => ctx.reply('Hello!'));
    bot.command('init', async (ctx) => {
      const chatId = ctx.chat.id;
      const message = await this.saveChat(chatId);
      return ctx.reply(message);
    });
    bot.command('remove', async (ctx) => {
      const chatId = ctx.chat.id;
      const message = await this.removeChat(chatId);
      return ctx.reply(message);
    });
    bot.command('help', (ctx) => {
      const message = `/init - зарегистрировать чат для отправки уведомлений` +
        `\n/remove - не отправлять уведомления в текущий чат` +
        `\n/amt - узнать количество записавшихся игроков`;
      return ctx.reply(message);
    });
    bot.hears(/фото/gm, (ctx) => {
      const query = ctx.update.message.text.split(' ')[1];
      if (!query) { return; }
      ctx.replyWithPhoto({
        url: `https://source.unsplash.com/600x400/?${translit(query)}`,
        filename: 'test.jpg',
      });
    });

    const amountScene = this.createAmountScene();

    const stage = new Stage([amountScene]);
    bot.use(session());
    bot.use(stage.middleware());

    bot.command('amt', (ctx: any) => ctx.scene.enter('amount'));
    bot.launch();

    return bot;
  }

  private async saveChat(chatId: number) {
    const chat = await this.chatModel.findOne({ chatId }).exec();
    if (chat) {
      return 'Chat already exist!';
    }
    const createChatDto: CreateChatDto = { chatId };
    const newChat = await this.chatModel(createChatDto);
    await newChat.save();

    return 'Done!';
  }

  private async removeChat(chatId: number) {
    await this.chatModel
      .findOneAndRemove({ chatId }).exec();

    return 'Done!';
  }

  private createAmountScene() {
    const stepHandler = new Composer();

    stepHandler.action(/event/gm, async (ctx) => {
      const eventId = ctx.callbackQuery.data.split('_')[1];
      const event = await this.eventModel.findById(eventId);
      ctx.reply(`Текущее количество игроков: ${ event.playersAmount }`);
      return ctx.scene.leave();
    })
    stepHandler.command('exit', (ctx) => {
      ctx.reply('exit')
      return ctx.scene.leave();
    })

    const amountScene = new WizardScene(
      'amount',
      async (ctx) => {
        const allEvents = await this.eventModel.find().exec();
        const activeEvents = getActiveEvents(allEvents);

        if (!activeEvents.length) {
          ctx.reply('Нет активных матчей');
          return ctx.scene.leave();
        }
        const buttons = activeEvents.map(event => {
          return Markup.callbackButton(`Матч: ${event.eventName}`, `event_${event._id}`);
        });
        ctx.reply('Какой матч?', Markup.inlineKeyboard(buttons).extra());
        return ctx.wizard.next();
      },
      stepHandler,
    );

    return amountScene;
  }

  async sendAddPlayerMessage(player: Player, event: Event) {
    const chats = await this.chatModel.find().exec();

    let message = `Игрок ${ player.name } пойдёт на матч "${ event.eventName }",`;
    if (player.friends.length) {
      const friends = player.friends.map(friend => friend.name);
      message += `\nДрузья: ${ friends.toString() }`;
    }
    message += `\nДата: ${ event.date },` +
    `\nТекущее количество игроков ${ event.playersAmount }`;
    if (!player.status) {
      message += '\nНо это не точно.';
    }

    chats.forEach(chat => {
      this.bot.telegram.sendMessage(chat.chatId, message);
    });
  }

  async sendDelPlayerMessage(player: Player, event: Event) {
    const chats = await this.chatModel.find().exec();

    let message = `Игрок ${ player.name } не пойдет на матч "${ event.eventName }",`;
    if (player.friends.length) {
      const friends = player.friends.map(friend => friend.name);
      message += `\nДрузья: ${ friends.toString() }`;
    }
    message += `\nДата: ${ event.date },` +
    `\nТекущее количество игроков ${ event.playersAmount }`;

    chats.forEach(chat => {
      this.bot.telegram.sendMessage(chat.chatId, message);
    });
  }

  async sendAddEventMessage(event: Event) {
    const chats = await this.chatModel.find().exec();

    const message = `Создан матч "${ event.eventName }",` +
    `\nДата: ${ event.date },` +
    `\nВремя: ${ event.time },` +
    `\nМесто: ${ event.place },` +
    `\nЗапись: https://football.ukit.space/event/${ event._id },`;

    chats.forEach(async chat => {
      const currentMessage = await this.bot.telegram.sendMessage(chat.chatId, message);
      await this.bot.telegram.pinChatMessage(chat.chatId, currentMessage.message_id);
    });
  }
}
