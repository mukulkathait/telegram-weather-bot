import { ApiService } from './api.service';
import { EncryptionUtilityService } from 'src/encryption-utility/encryption-utility.service';
import { CacheService } from 'src/cache/cache.service';
export declare class ApiController {
    private readonly apiService;
    private readonly encryptionService;
    private readonly cacheService;
    constructor(apiService: ApiService, encryptionService: EncryptionUtilityService, cacheService: CacheService);
    getAllKeys(): Promise<{
        id: string;
        telegram_bot_token: string;
        weather_api_key: string;
        jwt_secret: string;
        updatedAt: Date;
    }>;
    updateApiKeys(updatedApiData: {
        id: string;
        telegram_bot_token: string;
        weather_api_key: string;
        jwt_secret: string;
    }): Promise<{
        id: string;
        telegram_bot_token: string;
        weather_api_key: string;
        jwt_secret: string;
        updatedAt: Date;
    }>;
}
