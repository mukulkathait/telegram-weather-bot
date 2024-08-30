import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { UsersService } from 'src/users/users.service';
import { LocationService } from 'src/location/location.service';
import axios from 'axios';
import * as cron from 'node-cron';
import { Prisma } from '@prisma/client';

@Injectable()
export class BotService {
  private bot: Telegraf;
  private user: any;

  constructor(
    private readonly usersService: UsersService,
    private readonly locationService: LocationService,
  ) {
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
            `Welcome ${ctx.from.username}\nYou are subscribed to Weather Buddy. Your weather updates are scheduled at ${this.user.preferredTime} everyday.\n\nTo unsubscribe type /unsubscribe`,
          );
        else {
          ctx.reply(
            `Welcome ${ctx.from.username}\nSeems like you are not a Weather Buddy subcriber. Type /subscribe to get daily weather updates. Send your location to get weather info around you`,
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
          `Welcome! ${ctx.from.username}\nType /subscribe to get daily weather updates.\nSend your location to get weather info around you.`,
        );
      }
    });

    this.bot.on('text', (ctx) => {
      ctx.reply(`${ctx.message.text}`);
    });

    this.bot.on('location', async (ctx) => {
      const { latitude, longitude } = ctx.message.location;
      const { id: telegramId, username, first_name: firstName } = ctx.from;
      const tempUser = await this.usersService.findOne(ctx.from.id.toString());
      // TODO : display forecast nomatter what
      if (!tempUser) {
        const createUserData = {
          telegramId: telegramId.toString(),
          username,
          firstName,
          languageCode: ctx.from.language_code,
          location: {
            create: {
              latitude,
              longitude,
            },
          },
        };
        this.user = await this.usersService.createUser(createUserData);
      } else {
        if (
          !(
            tempUser.location.latitude === latitude &&
            tempUser.location.longitude === longitude
          )
        ) {
          ctx.reply(
            `Your subscribed location is different do you want to updated your subscribed location to this one?\nType "yes" to update location, type "no" otherwise`,
          );
          this.bot.on('text', async (ctx) => {
            const response = ctx.message.text;
            if (response.toLowerCase() === 'yes') {
              this.user = await this.usersService.updateUserWithLocation(
                this.user.id,
                this.user,
                {
                  latitude,
                  longitude,
                },
              );
            } else if (response.toLowerCase() === 'no') {
              ctx.reply(
                `Your location data is not updated.\n\nYour weather updates are scheduled at ${this.user.preferredTime} everyday.\n\nTo unsubscribe type /unsubscribe`,
              );
            } else {
              ctx.reply(
                `Whoops!! Seems like you mistyped something.\n\nNo worry, I got you. Your location data is not updated.\n\nYour weather updates are scheduled at ${this.user.preferredTime} everyday.\n\nTo unsubscribe type /unsubscribe`,
              );
            }
          });
        } else {
        }
      }
      /* 
      ctx.reply(`
      Weather for ${weatherData.location}
    
      - Condition: ${weatherData.condition}
      - Temperature: ${weatherData.temperature}℃ (Feels like: ${weatherData.feels_like}℃)
      - Humidity: ${weatherData.humidity}%
      - Wind: ${weatherData.wind.speed} m/s, direction ${weatherData.wind.direction}° with gusts up to ${weatherData.wind.gusts} m/s
      - Pressure: ${weatherData.pressure} hPa
      - Cloud Cover: ${weatherData.cloud_cover}%
      - Visibility: ${weatherData.visibility} km
    
      Sunrise: ${weatherData.sunrise}
      Sunset: ${weatherData.sunset}
    `); */
    });

    this.bot.command('subscribe', async (ctx) => {
      const {
        id: telegramId,
        username,
        first_name: firstName,
      } = ctx.message.from;
      const tempUser = await this.usersService.findOne(ctx.from.id.toString());
      if (tempUser) {
        this.user = tempUser;
        if (this.user.isSubscribed)
          ctx.reply(
            `Welcome ${ctx.from.username}\nYou are already subscribed to Weather Buddy. Your weather updates are scheduled at ${this.user.preferredTime} everyday.\nIf you want to change your location, just send your current location.\n\nTo unsubscribe type /unsubscribe.`,
          );
      } else {
        const data = {
          telegramId: telegramId.toString(),
          username,
          firstName,
          languageCode: ctx.from.language_code,
        };
        this.user = await this.usersService.createUser(data);

        ctx.reply(
          'Thanks for subscribing to Weather Buddy.\nBefore making you a Weather Buddy subscriber, we need a few of your preferences. Kindly answer a few questions.\n\nPlease enter the time you would like to receive the weather update (in HH:mm format) Eg. 09:15, 17:30, etc.',
        );

        let attempts = 5;

        const messageHandler = async (ctx) => {
          const time = ctx.message.text;
          const isValidTime = this.validateTimeFormat(time);

          if (isValidTime) {
            const { id: telegramId } = ctx.from;
            await this.usersService.updateUser(telegramId.toString(), {
              preferredTime: time,
              isSubscribed: true,
            });

            ctx.reply(`I'll provide a weather forecast at ${time} every day.`);
            this.scheduleWeatherUpdate(time);

            // Remove the listener after success
            this.bot.stop('Thanks for subscribing!!');
          } else {
            attempts -= 1;

            if (attempts > 0) {
              ctx.reply(
                'Invalid time format. Please enter the time in HH:mm format.',
              );
            } else {
              this.bot.stop(
                'Too many invalid attempts. Please try subscribing again later.',
              ); // Remove listener after attempts exceeded
            }
          }
        };
        this.bot.on('text', messageHandler);
      }
    });

    this.bot.launch();
  }
  public validateTimeFormat(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }

  private scheduleWeatherUpdate(time: string) {
    const [hour, minute] = time.split(':').map(Number);
    const cronExpression = `${minute} ${hour} * * *`;
    cron.schedule(cronExpression, async () => {
      const weatherUpdate = await this.getWeatherUpdateForUser();
      this.bot.telegram.sendMessage(
        this.user.telegramId,
        `Here is your weather update: ${weatherUpdate}`,
      );
    });
  }

  public async sendWeatherUpdate(chatId: number, weatherInfo: string) {
    await this.bot.telegram.sendMessage(
      chatId,
      `Today's weather: ${weatherInfo}`,
    );
  }

  private async getWeatherUpdateForUser() {
    const weatherInfo = await this.getWeatherInfo(
      this.user.location.latitude,
      this.user.location.longitude,
    );
    const weatherData = this.transformWeatherJson(weatherInfo);
    return weatherData;
  }

  public async getWeatherInfo(latitude: number, longitude: number) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${process.env.WEATHER_API_KEY}`;
    try {
      const response = await axios.get(url);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log('ERROR: ' + error);
      return null;
    }
  }

  public displayWeatherInfo(weatherData: any) {
    console.log(`
      Weather for ${weatherData.location}
    
      - Condition: ${weatherData.condition}
      - Temperature: ${weatherData.temperature.temp}℃ (Feels like: ${weatherData.feels_like}℃)
      - Humidity: ${weatherData.humidity}%
      - Wind: ${weatherData.wind.speed} m/s, direction ${weatherData.wind.direction}° with gusts up to ${weatherData.wind.gusts} m/s
      - Pressure: ${weatherData.pressure} hPa
      - Cloud Cover: ${weatherData.cloud_cover}%
      - Visibility: ${weatherData.visibility} km
    
      Sunrise: ${weatherData.sunrise}
      Sunset: ${weatherData.sunset}
    `);
  }

  public transformWeatherJson(responseJson: any) {
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
        speed: responseJson.main.speed,
        direction: responseJson.main.deg,
        gusts: responseJson.main.gust,
      },
      pressure: responseJson.main.pressure,
      cloud_cover: responseJson.clouds.all,
      visibility: responseJson.visibility / 1000,
      sunrise: this.convertDateTime(
        responseJson.sys.sunrise,
        responseJson.timezone,
      ),
      sunset: this.convertDateTime(
        responseJson.sys.sunset,
        responseJson.timezone,
      ),
      icon: responseJson.weather[0].icon,
    };
    return weatherData;
  }

  public convertTemperature(tempKelvin: number) {
    return tempKelvin - 273.15;
  }

  public convertDateTime(unixTimestamp, timezone) {
    console.log(`TIME: ${unixTimestamp} + ${timezone}`);
    console.log('TOTAL TIME: ', unixTimestamp + timezone);
    const total_time = Number(unixTimestamp) + Number(timezone);
    console.log(typeof unixTimestamp);
    console.log(typeof timezone);
    console.log('Total: ________------', total_time);
    const date = new Date(total_time * 1000);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const formattedTime = hours + ':' + minutes.substr(-2);
    console.log(formattedTime);
    return formattedTime;
  }
}
