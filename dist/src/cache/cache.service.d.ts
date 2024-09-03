import { ApiService } from 'src/api/api.service';
import { EncryptionUtilityService } from 'src/encryption-utility/encryption-utility.service';
interface ApiKeysInterface {
    id: string;
    telegram_bot_token: string;
    weather_api_key: string;
    jwt_secret: string;
    updatedAt?: Date | string;
}
export declare class CacheService {
    private readonly apiService;
    private readonly encryptionService;
    private apiKeys;
    constructor(apiService: ApiService, encryptionService: EncryptionUtilityService);
    getApiKeys(): Promise<ApiKeysInterface>;
    getJwtSecret(): Promise<string>;
    getBotToken(): Promise<string>;
    getWeatherApiKey(): Promise<string>;
    setApiKeys(apiKeys: ApiKeysInterface): void;
    clearCache(): void;
}
export {};
