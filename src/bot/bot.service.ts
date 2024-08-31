import { Injectable } from '@nestjs/common';
import { Context, Telegraf, Composer } from 'telegraf';
import { UsersService } from 'src/users/users.service';
import { LocationService } from 'src/location/location.service';
import axios from 'axios';
import * as cron from 'node-cron';

@Injectable()
export class BotService {
  private bot: Telegraf;
  private user: any;
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
      console.log('+++++++++++++++++++++tempUser++++++++++++++++++++++++++');
      console.log(tempUser);
      console.log('+++++++++++++++++++++tempUser++++++++++++++++++++++++++');
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
        console.log('+++++++++++++++++++++this.user++++++++++++++++++++++++++');
        console.log(this.user);
        console.log('+++++++++++++++++++++this.user++++++++++++++++++++++++++');
        ctx.reply(
          `Welcome! ${ctx.from.username}\nType /subscribe to get daily weather updates.\nSend your location to get weather info around you.`,
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
            'Location saved. At what time would you like to receive daily weather updates? (e.g., 08:00)',
          );
      } else {
        //   const weatherData = await this.getWeatherUpdateForUser(
        //     latitude,
        //     longitude,
        //   );
        //   this.bot.telegram.sendMessage(
        //     telegramId,
        //     `
        //   Weather for ${weatherData.location}

        //   - Condition: ${weatherData.condition}
        //   - Temperature: ${weatherData.temperature}℃ (Feels like: ${weatherData.feels_like}℃)
        //   - Humidity: ${weatherData.humidity}%
        //   - Wind: ${weatherData.wind.speed} m/s, direction ${weatherData.wind.direction}° with gusts up to ${weatherData.wind.gusts} m/s
        //   - Pressure: ${weatherData.pressure} hPa
        //   - Cloud Cover: ${weatherData.cloud_cover}%
        //   - Visibility: ${weatherData.visibility} km

        //   Sunrise: ${weatherData.sunrise}
        //   Sunset: ${weatherData.sunset}
        // `,
        //   );
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
          'Thanks for subscribing to Weather Buddy.\nBefore making you a Weather Buddy subscriber, we need a few of your preferences. Kindly answer a few questions.\n\nPlease enter the time you would like to receive the weather update (in HH:mm format) Eg. 09:15, 17:30, etc.',
        );
      }

      /* if (this.user.isSubscribed) {
        } else {
        let attempts = 5;
      
      // Create a middleware to handle the time input
      const timeInputHandler = new Composer<Context>();
      
      timeInputHandler.on('text', async (ctx) => {
        const time = ctx.message.text;
        const isValidTime = this.validateTimeFormat(time);
        
        if (isValidTime) {
          // if(!this.user.location){
            //   ctx.reply(`Now share your location.`)
            
            // }
            await this.usersService.updateUser(telegramId.toString(), {
              preferredTime: time,
              isSubscribed: true,
              });
              
              ctx.reply(`I'll provide a weather forecast at ${time} every day.`);
              this.scheduleWeatherUpdate(this.user, time);
              
              // Remove this handler after success
              this.bot.use(timeInputHandler.middleware());
              // Clear the middleware stack for this handler
              timeInputHandler.middleware = () => (ctx, next) => next();
              } else {
            attempts -= 1;
          
          if (attempts > 0) {
              ctx.reply(
                'Invalid time format. Please enter the time in HH:mm format.',
              );
            } else {
              ctx.reply(
                'Too many invalid attempts. Please try subscribing again later.',
                );
                
                // Remove this handler after too many invalid attempts
                this.bot.use(timeInputHandler.middleware());
                // Clear the middleware stack for this handler
                timeInputHandler.middleware = () => (ctx, next) => next();
                }
                }
        });

        // Register the middleware for text handling
        this.bot.use(timeInputHandler.middleware());
      } */
    });

    this.bot.command('unsubscribe', async (ctx) => {
      if (this.user && !this.user.isSubscribed) {
        ctx.reply(`Your are not a subscriber`);
      }
      const userUpdateData = {
        isSubscribed: false,
        preferredTime: null,
      };
      const userLocationUpdateData = {
        latitude: null,
        longitude: null,
      };
      await this.usersService.updateUserWithLocation(
        ctx.from.id.toString(),
        userUpdateData,
        userLocationUpdateData,
      );
      ctx.reply(
        `You have been unsubscribed from Weather Buddy.\nBut don't you worry, if you ever changed your mind, type /subscribe to subscribe again.`,
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
          const user = await this.usersService.updateUser(
            ctx.from.id.toString(),
            updatedData,
          );

          this.userSubscriptionState.delete(telegramId);
          this.scheduleWeatherUpdate(this.user, time);

          ctx.reply(
            `You're now subscribed to daily weather updates at ${time} for your current location.`,
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
        this.scheduleWeatherUpdate(user.isSubscribed, user.preferredTime);
      }
    }
  }

  public validateTimeFormat(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }

  private scheduleWeatherUpdate(associatedUser: any, time: string) {
    const [hour, minute] = time.split(':').map(Number);
    const cronExpression = `${minute} ${hour} * * *`;
    cron.schedule(cronExpression, async () => {
      const weatherData = await this.getWeatherUpdateForUser(
        associatedUser.location.latitude,
        associatedUser.location.longitude,
      );
      this.bot.telegram.sendMessage(
        associatedUser.telegramId,
        `
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
    `,
      );
    });
  }

  private async getWeatherUpdateForUser(latitude: number, longitude: number) {
    const weatherInfo = await this.getWeatherInfo(latitude, longitude);
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
