import { UsersService } from 'src/users/users.service';
import { CacheService } from 'src/cache/cache.service';
export declare class BotService {
    private readonly usersService;
    private readonly cacheService;
    private bot;
    private user;
    private attempts;
    private userSubscriptionState;
    constructor(usersService: UsersService, cacheService: CacheService);
    onModuleInit(): Promise<void>;
    private initializeBot;
    private capitalizeFirstLetter;
    private validateTimeFormat;
    private scheduleWeatherUpdate;
    private getWeatherUpdateForUser;
    private getWeatherInfo;
    private transformWeatherJson;
    private convertTemperature;
    private convertDateTime;
}
