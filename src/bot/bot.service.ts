import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import * as cron from 'node-cron';

@Injectable()
export class BotService {
  private bot: Telegraf;
  private user: {
    id?: string;
    telegramId: string;
    firstName?: string | null;
    username?: string | null;
    isSubscribed?: boolean;
    subscribedAt?: Date | string;
    preferredTime?: string | null;
    languageCode?: string | null;
    isNotified?: boolean;
    isblocked?: boolean;
    location?: {
      id?: string;
      latitude?: number | null;
      longitude?: number | null;
      userId: string;
    };
  };
  private attempts: number;
  private userSubscriptionState = new Map<string, boolean>();

  constructor(private readonly usersService: UsersService) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      throw new Error('TELEGRAM_BOT_API environment variable is not set');
    }

    this.bot = new Telegraf(botToken);

    this.bot.start(async (ctx) => {
      const { id: telegramId, username, first_name: firstName } = ctx.from;
      const tempUser = await this.usersService.findOne(ctx.from.id.toString());
      if (tempUser) {
        this.user = tempUser;
        if (this.user.isSubscribed)
          ctx.reply(
            `Welcome ${ctx.from.username}\nYou are subscribed to Weather Buddy. Your weather updates are scheduled at ${this.user.preferredTime} everyday.\n\nTo unsubscribe, type /unsubscribe\n\nType /help, if you feel lost.`,
          );
        else {
          ctx.reply(
            `Welcome ${ctx.from.username}\nSeems like you are not a Weather Buddy subcriber. Type /subscribe to get daily weather updates. Send your location to get weather info around you.\n\nType /help, if you feel lost.`,
          );
        }
      } else {
        const data = {
          telegramId: telegramId.toString(),
          username,
          firstName,
          languageCode: ctx.from.language_code,
        };
        this.user = await this.usersService.createUser(data);
        ctx.reply(
          `Hey ${ctx.from.username}, Welcome to Weather Buddy, your personal weather companion.\n\nHere are some commands to get you started with Weather Buddy.\nTo get weather info of your current location, send us you location by clicking attach icon on the bottom right side of your screen, beside microphone icon. Then press Location icon, then press "Send selected location".\n\nType /subscribe to get daily weather updates.\n\nType /help, if you feel lost.`,
        );
      }
    });

    this.bot.on('location', async (ctx) => {
      const { latitude, longitude } = ctx.message.location;
      const isSubscribing = this.userSubscriptionState.get(
        ctx.from.id.toString(),
      );

      console.log('isSubscribing: ', isSubscribing);
      console.log('userSubscriptionState', this.userSubscriptionState);

      if (isSubscribing) {
        const locationUpdated = await this.usersService.updateUserWithLocation(
          ctx.from.id.toString(),
          {},
          { latitude, longitude },
        );
        // Ask for preferred time
        if (locationUpdated)
          ctx.reply(
            'Your location have been updated successfully.\n\nAt what time would you like to receive daily weather updates? (e.g., 08:00,18:00)',
          );
      } else {
        const weatherData = await this.getWeatherUpdateForUser(
          latitude,
          longitude,
        );
        this.bot.telegram.sendMessage(
          ctx.from.id,
          `
          Weather for ${weatherData.location}

          - Condition: ${this.capitalizeFirstLetter(weatherData.condition)}
          - Temperature: ${weatherData.temperature.temp.toFixed(1)}℃ (Feels like: ${weatherData.feels_like.toFixed(1)}℃)
          - Humidity: ${weatherData.humidity}%
          - Wind: ${weatherData.wind.speed} m/s, direction ${weatherData.wind.direction}° with gusts up to ${weatherData.wind.gusts} m/s
          - Pressure: ${weatherData.pressure} hPa
          - Cloud Cover: ${weatherData.cloud_cover}%
          - Visibility: ${weatherData.visibility} km

          Sunrise: ${weatherData.sunrise}
          Sunset: ${weatherData.sunset}
        `,
        );
        ctx.reply('Location Data');
      }
    });

    this.bot.command('subscribe', async (ctx) => {
      this.attempts = 5;
      const {
        id: telegramId,
        username,
        first_name: firstName,
      } = ctx.message.from;
      if (!this.user) {
        const tempUser = await this.usersService.findOne(telegramId.toString());
        if (!tempUser) {
          const data = {
            telegramId: telegramId.toString(),
            username,
            firstName,
            languageCode: ctx.from.language_code,
          };
          this.user = await this.usersService.createUser(data);
        }
        this.user = tempUser;
      }

      if (this.user.isSubscribed) {
        ctx.reply(
          `Welcome ${ctx.from.username}\nYou are already subscribed to Weather Buddy. Your weather updates are scheduled at ${this.user.preferredTime} every day.\n\nTo unsubscribe, type /unsubscribe.`,
        );
      } else {
        const telegramId = ctx.from.id.toString();
        this.userSubscriptionState.set(telegramId, true);
        ctx.reply(
          'Thanks for subscribing to Weather Buddy.\n\nBefore making you a Weather Buddy subscriber, we need a few of your preferences.\nStep 1/2: Kindly share your location with Weather Buddy by clicking attach icon on the bottom right side of your screen, beside microphone icon. Then press Location icon, then press "Send selected location".',
        );
      }
    });

    this.bot.command('unsubscribe', async (ctx) => {
      if (this.user && !this.user.isSubscribed) {
        ctx.reply(
          `Whoops!! You're not a Weather Buddy subscriber I guess.\n\nType /help, if you feel lost.`,
        );
      }
      const userUpdateData = {
        isSubscribed: false,
        preferredTime: null,
      };
      const userLocationUpdateData = {
        latitude: null,
        longitude: null,
      };
      this.user = await this.usersService.updateUserWithLocation(
        ctx.from.id.toString(),
        userUpdateData,
        userLocationUpdateData,
      );
      ctx.reply(
        `You have been unsubscribed from Weather Buddy.\nBut don't you worry, if you ever changed your mind, type /subscribe to subscribe again.\nType /help, if you feel lost.`,
      );
    });

    this.bot.command('help', (ctx) => {
      ctx.reply(
        `Here are some commands that can be used to navigate Weather Buddy.\n\n/start: To activate Weather Buddy.\n/subscribe : To get subscribed to Weather Buddy for daily weather updates of your location.\n/unsubscribe: To unsubscribe from Weather Buddy.\n\nFurther, you can send your location any time to get weather updates near you. How?\nTo get weather info of your current location, send us you location by clicking attach icon on the bottom right side of your screen, beside microphone icon. Then press Location icon, then press "Send selected location".`,
      );
    });

    this.bot.on('text', async (ctx) => {
      const telegramId = ctx.from.id.toString();
      const isSubscribing = this.userSubscriptionState.get(telegramId);

      if (isSubscribing) {
        const time = ctx.message.text;
        const isValidTime = this.validateTimeFormat(time);

        if (isValidTime) {
          //TODO: update time on db and make isSubscribed: true
          const updatedData = {
            preferredTime: time,
            isSubscribed: true,
          };
          this.user = await this.usersService.updateUser(
            ctx.from.id.toString(),
            updatedData,
          );

          this.userSubscriptionState.delete(telegramId);
          const location = {
            latitude: this.user.location.latitude,
            longitude: this.user.location.longitude,
          };
          this.scheduleWeatherUpdate(
            this.user.telegramId,
            location,
            this.user.preferredTime,
          );

          ctx.reply(
            `Hurray, You're now a Weather Buddy subscriber.\nYou'll receive daily weather updates at ${time} for your current location.\n\nIf you ever want to unsubscribe from Weather Buddy, type /unsubscribe`,
          );
        } else {
          this.attempts -= 1;

          if (this.attempts > 0) {
            ctx.reply(
              'Invalid time format. Please enter the time in HH:mm format(24hrs format).',
            );
          } else {
            ctx.reply(
              'Too many invalid attempts. Please try subscribing again later.',
            );
            this.userSubscriptionState.delete(telegramId);
          }
        }
      } else {
        ctx.reply(`You said: ${ctx.message.text}`);
      }
    });

    this.bot.launch();
  }

  async onModuleInit() {
    const users = await this.usersService.getAllUsers();
    for (const user of users) {
      if (user.isSubscribed && user.preferredTime) {
        const location = {
          latitude: user.location.latitude,
          longitude: user.location.longitude,
        };
        this.scheduleWeatherUpdate(
          user.telegramId,
          location,
          user.preferredTime,
        );
      }
    }
  }

  private capitalizeFirstLetter(sentence: string): string {
    return sentence
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private validateTimeFormat(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }

  private scheduleWeatherUpdate(
    userTelegramId: string,
    location: { latitude: number; longitude: number },
    time: string,
  ) {
    const [hour, minute] = time.split(':').map(Number);
    const cronExpression = `${minute} ${hour} * * *`;
    cron.schedule(cronExpression, async () => {
      const weatherData = await this.getWeatherUpdateForUser(
        location.latitude,
        location.longitude,
      );
      this.bot.telegram.sendMessage(
        userTelegramId,
        `
          Weather for ${weatherData.location}

          - Condition: ${this.capitalizeFirstLetter(weatherData.condition)}
          - Temperature: ${weatherData.temperature.temp.toFixed(1)}℃ (Feels like: ${weatherData.feels_like.toFixed(1)}℃)
          - Humidity: ${weatherData.humidity}%
          - Wind: ${weatherData.wind.speed} m/s, direction ${weatherData.wind.direction}° with gusts up to ${weatherData.wind.gusts} m/s
          - Pressure: ${weatherData.pressure} hPa
          - Cloud Cover: ${weatherData.cloud_cover}%
          - Visibility: ${weatherData.visibility} km

          Sunrise: ${weatherData.sunrise}
          Sunset: ${weatherData.sunset}
        `,
      );
    });
  }

  private async getWeatherUpdateForUser(latitude: number, longitude: number) {
    const weatherInfo = await this.getWeatherInfo(latitude, longitude);
    const weatherData = this.transformWeatherJson(weatherInfo);
    return weatherData;
  }

  private async getWeatherInfo(latitude: number, longitude: number) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${process.env.WEATHER_API_KEY}`;
    console.log('URL : ', url);
    try {
      const response = await axios.get(url);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('ERROR: ', error);
      return null;
    }
  }

  private transformWeatherJson(responseJson: any) {
    const weatherData = {
      location: responseJson.name + ', ' + responseJson.sys.country,
      condition: responseJson.weather[0].description,
      temperature: {
        temp_min: this.convertTemperature(responseJson.main.temp_min),
        temp_max: this.convertTemperature(responseJson.main.temp_max),
        temp: this.convertTemperature(responseJson.main.temp),
      },
      feels_like: this.convertTemperature(responseJson.main.feels_like),
      humidity: responseJson.main.humidity,
      wind: {
        speed: responseJson.wind.speed,
        direction: responseJson.wind.deg,
        gusts: responseJson.wind.gust,
      },
      pressure: responseJson.main.pressure,
      cloud_cover: responseJson.clouds.all,
      visibility: responseJson.visibility / 1000,
      sunrise: this.convertDateTime(responseJson.sys.sunrise),
      sunset: this.convertDateTime(responseJson.sys.sunset),
      icon: responseJson.weather[0].icon,
    };
    return weatherData;
  }

  private convertTemperature(tempKelvin: number) {
    return tempKelvin - 273.15;
  }

  private convertDateTime(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const formattedTime = hours + ':' + minutes.substr(-2);
    console.log('Formatted Time : ', formattedTime);
    return formattedTime;
  }
}
