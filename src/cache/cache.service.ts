import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ApiService } from 'src/api/api.service';
import { EncryptionUtilityService } from 'src/encryption-utility/encryption-utility.service';

interface ApiKeysInterface {
  id: string;
  telegram_bot_token: string;
  weather_api_key: string;
  jwt_secret: string;
  updatedAt?: Date | string;
}

@Injectable()
export class CacheService {
  private apiKeys: ApiKeysInterface | null = null;

  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    private readonly encryptionService: EncryptionUtilityService,
  ) {}

  async getApiKeys(): Promise<ApiKeysInterface> {
    if (!this.apiKeys) {
      const apiKeysResponse = await this.apiService.getApis();
      (apiKeysResponse[0].telegram_bot_token = this.encryptionService.decrypt(
        apiKeysResponse[0].telegram_bot_token,
      )),
        (apiKeysResponse[0].weather_api_key = this.encryptionService.decrypt(
          apiKeysResponse[0].weather_api_key,
        )),
        (apiKeysResponse[0].jwt_secret = this.encryptionService.decrypt(
          apiKeysResponse[0].jwt_secret,
        )),
        (this.apiKeys = apiKeysResponse[0]);
    }
    return this.apiKeys;
  }

  async getJwtSecret(): Promise<string> {
    const keys = await this.getApiKeys();
    return keys.jwt_secret;
  }

  async getBotToken(): Promise<string> {
    const keys = await this.getApiKeys();
    return keys.telegram_bot_token;
  }

  async getWeatherApiKey(): Promise<string> {
    const keys = await this.getApiKeys();
    return keys.weather_api_key;
  }

  setApiKeys(apiKeys: ApiKeysInterface) {
    this.apiKeys = apiKeys;
  }

  clearCache() {
    this.apiKeys = null;
  }
}
