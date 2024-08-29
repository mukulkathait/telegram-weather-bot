import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class BotService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_API);

    this.bot.start((ctx) => {
      ctx.reply('Welcome! Type /subscribe to get daily weather updates.');
      console.log(ctx);
      console.log(ctx.update.message.from);
      console.log(ctx.update.message.chat);
      console.log(ctx.update.message.entities);
    });

    this.bot.command('subscribe', (ctx) => {
      const chatId = ctx.chat.id;
      console.log(ctx);
      console.log(ctx.args);
      // Add user to the subscription list
      ctx.reply('You have subscribed to daily weather updates!');
    });

    this.bot.launch();
  }

  public async sendWeatherUpdate(chatId: number, weatherInfo: string) {
    await this.bot.telegram.sendMessage(
      chatId,
      `Today's weather: ${weatherInfo}`,
    );
  }
}
