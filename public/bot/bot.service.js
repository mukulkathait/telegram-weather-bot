"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const users_service_1 = require("../users/users.service");
const axios_1 = require("axios");
const cron = require("node-cron");
const cache_service_1 = require("../cache/cache.service");
let BotService = class BotService {
    constructor(usersService, cacheService) {
        this.usersService = usersService;
        this.cacheService = cacheService;
        this.userSubscriptionState = new Map();
    }
    async onModuleInit() {
        const botToken = await this.cacheService.getBotToken();
        if (!botToken) {
            throw new Error('Telegram bot token is not set in the database');
        }
        this.bot = new telegraf_1.Telegraf(botToken);
        this.initializeBot();
        this.bot.launch();
        const users = await this.usersService.getAllUsers();
        for (const user of users) {
            if (user.isSubscribed && user.preferredTime) {
                const location = {
                    latitude: user.location.latitude,
                    longitude: user.location.longitude,
                };
                this.scheduleWeatherUpdate(user.telegramId, location, user.preferredTime);
            }
        }
    }
    initializeBot() {
        this.bot.start(async (ctx) => {
            if (await this.checkIfUserIsBlocked(ctx))
                return;
            const { id: telegramId, username, first_name: firstName } = ctx.from;
            const tempUser = await this.usersService.findOne(ctx.from.id.toString());
            if (tempUser) {
                this.user = tempUser;
                if (this.user.isSubscribed)
                    ctx.reply(`Welcome ${ctx.from.username}\nYou are subscribed to Weather Buddy. Your weather updates are scheduled at ${this.user.preferredTime} everyday.\n\nTo unsubscribe, type /unsubscribe\n\nType /help, if you feel lost.`);
                else {
                    ctx.reply(`Welcome ${ctx.from.username}\nSeems like you are not a Weather Buddy subscriber. Type /subscribe to get daily weather updates. Send your location to get weather info around you.\n\nType /help, if you feel lost.`);
                }
            }
            else {
                const data = {
                    telegramId: telegramId.toString(),
                    username,
                    firstName,
                    languageCode: ctx.from.language_code,
                };
                this.user = await this.usersService.createUser(data);
                ctx.reply(`Hey ${ctx.from.username}, Welcome to Weather Buddy, your personal weather companion.\n\nHere are some commands to get you started with Weather Buddy.\nTo get weather info of your current location, send us you location by clicking attach icon on the bottom right side of your screen, beside microphone icon. Then press Location icon, then press "Send selected location".\n\nType /subscribe to get daily weather updates.\n\nType /help, if you feel lost.`);
            }
        });
        this.bot.on('location', async (ctx) => {
            if (await this.checkIfUserIsBlocked(ctx))
                return;
            const { latitude, longitude } = ctx.message.location;
            const isSubscribing = this.userSubscriptionState.get(ctx.from.id.toString());
            console.log('isSubscribing: ', isSubscribing);
            console.log('userSubscriptionState', this.userSubscriptionState);
            if (isSubscribing) {
                const locationUpdated = await this.usersService.updateUserWithLocation(ctx.from.id.toString(), {}, { latitude, longitude });
                if (locationUpdated)
                    ctx.reply('Your location has been updated successfully.\n\nAt what time would you like to receive daily weather updates? (e.g., 08:00,18:00)');
            }
            else {
                const weatherData = await this.getWeatherUpdateForUser(latitude, longitude);
                this.bot.telegram.sendMessage(ctx.from.id, `
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
        `);
            }
        });
        this.bot.command('subscribe', async (ctx) => {
            if (await this.checkIfUserIsBlocked(ctx))
                return;
            this.attempts = 5;
            const { id: telegramId, username, first_name: firstName, } = ctx.message.from;
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
                ctx.reply(`Welcome ${ctx.from.username}\nYou are already subscribed to Weather Buddy. Your weather updates are scheduled at ${this.user.preferredTime} every day.\n\nTo unsubscribe, type /unsubscribe.`);
            }
            else {
                const telegramId = ctx.from.id.toString();
                this.userSubscriptionState.set(telegramId, true);
                ctx.reply('Thanks for subscribing to Weather Buddy.\n\nBefore making you a Weather Buddy subscriber, we need a few of your preferences.\nStep 1/2: Kindly share your location with Weather Buddy by clicking attach icon on the bottom right side of your screen, beside microphone icon. Then press Location icon, then press "Send selected location".');
            }
        });
        this.bot.command('unsubscribe', async (ctx) => {
            if (await this.checkIfUserIsBlocked(ctx))
                return;
            if (this.user && !this.user.isSubscribed) {
                ctx.reply(`Whoops!! You're not a Weather Buddy subscriber I guess.\n\nType /help, if you feel lost.`);
            }
            const userUpdateData = {
                isSubscribed: false,
                preferredTime: null,
            };
            const userLocationUpdateData = {
                latitude: null,
                longitude: null,
            };
            this.user = await this.usersService.updateUserWithLocation(ctx.from.id.toString(), userUpdateData, userLocationUpdateData);
            ctx.reply(`You have been unsubscribed from Weather Buddy.\nBut don't you worry, if you ever changed your mind, type /subscribe to subscribe again.\nType /help, if you feel lost.`);
        });
        this.bot.command('help', async (ctx) => {
            if (await this.checkIfUserIsBlocked(ctx))
                return;
            ctx.reply(`Here are some commands that can be used to navigate Weather Buddy.\n\n/start: To activate Weather Buddy.\n/subscribe : To get subscribed to Weather Buddy for daily weather updates of your location.\n/unsubscribe: To unsubscribe from Weather Buddy.\n/help: If you are having hard time navigating Weather Buddy.\n\nFurther, you can send your location any time to get weather updates near you. How?\nTo get weather info of your current location, send us you location by clicking attach icon on the bottom right side of your screen, beside microphone icon. Then press Location icon, then press "Send selected location".`);
        });
        this.bot.on('text', async (ctx) => {
            if (await this.checkIfUserIsBlocked(ctx))
                return;
            const telegramId = ctx.from.id.toString();
            const isSubscribing = this.userSubscriptionState.get(telegramId);
            if (isSubscribing) {
                const time = ctx.message.text;
                const isValidTime = this.validateTimeFormat(time);
                if (isValidTime) {
                    const updatedData = {
                        preferredTime: time,
                        isSubscribed: true,
                    };
                    this.user = await this.usersService.updateUser(ctx.from.id.toString(), updatedData);
                    this.userSubscriptionState.delete(telegramId);
                    const location = {
                        latitude: this.user.location.latitude,
                        longitude: this.user.location.longitude,
                    };
                    this.scheduleWeatherUpdate(this.user.telegramId, location, this.user.preferredTime);
                    ctx.reply(`Perfect! You are now subscribed to Weather Buddy. I'll provide weather updates at ${time} every day. To unsubscribe, type /unsubscribe.\n\nType /help, if you feel lost.`);
                }
                else {
                    this.attempts--;
                    if (this.attempts > 0) {
                        ctx.reply(`Oops! Seems like ${ctx.message.text} is not a valid time. Please try again. (${this.attempts} attempts left)`);
                    }
                    else {
                        this.userSubscriptionState.delete(telegramId);
                        ctx.reply(`Maximum attempts exceeded. Please try again by typing /subscribe.`);
                    }
                }
            }
            else {
                ctx.reply(`Seems like you're lost!! But don't worry, here are some commands that can be used to navigate Weather Buddy.\n\n/start: To activate Weather Buddy.\n/subscribe : To get subscribed to Weather Buddy for daily weather updates of your location.\n/unsubscribe: To unsubscribe from Weather Buddy.\n/help: If you are having hard time navigating Weather Buddy.\n\nFurther, you can send your location any time to get weather updates near you. How?\nTo get weather info of your current location, send us you location by clicking attach icon on the bottom right side of your screen, beside microphone icon. Then press Location icon, then press "Send selected location".`);
            }
        });
    }
    async checkIfUserIsBlocked(ctx) {
        const userId = ctx.from.id.toString();
        const user = await this.usersService.findOne(userId);
        if (user && user.isblocked) {
            ctx.reply('BLOCKED BY ADMIN: You have been blocked by the admin!');
            return true;
        }
        return false;
    }
    capitalizeFirstLetter(sentence) {
        return sentence
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    validateTimeFormat(time) {
        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(time);
    }
    scheduleWeatherUpdate(userTelegramId, location, time) {
        const [hour, minute] = time.split(':').map(Number);
        const cronExpression = `${minute} ${hour} * * *`;
        cron.schedule(cronExpression, async () => {
            const weatherData = await this.getWeatherUpdateForUser(location.latitude, location.longitude);
            this.bot.telegram.sendMessage(userTelegramId, `
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
        `);
        });
    }
    async getWeatherUpdateForUser(latitude, longitude) {
        const weatherInfo = await this.getWeatherInfo(latitude, longitude);
        const weatherData = this.transformWeatherJson(weatherInfo);
        return weatherData;
    }
    async getWeatherInfo(latitude, longitude) {
        const weatherApiKey = await this.cacheService.getWeatherApiKey();
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude={part}&appid=${weatherApiKey}`;
        console.log('URL : ', url);
        try {
            const response = await axios_1.default.get(url);
            console.log(response.data);
            return response.data;
        }
        catch (error) {
            console.log('ERROR: ', error);
            return null;
        }
    }
    transformWeatherJson(responseJson) {
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
    convertTemperature(tempKelvin) {
        return tempKelvin - 273.15;
    }
    convertDateTime(unixTimestamp) {
        const date = new Date(unixTimestamp * 1000);
        const hours = date.getHours();
        const minutes = '0' + date.getMinutes();
        const formattedTime = hours + ':' + minutes.substr(-2);
        console.log('Formatted Time : ', formattedTime);
        return formattedTime;
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        cache_service_1.CacheService])
], BotService);
