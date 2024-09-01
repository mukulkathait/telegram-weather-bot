import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { EncryptionUtilityService } from 'src/encryption-utility/encryption-utility.service';
import { CacheService } from 'src/cache/cache.service';

@Controller('api')
export class ApiController {
  constructor(
    private readonly apiService: ApiService,
    private readonly encryptionService: EncryptionUtilityService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  async getAllKeys() {
    const apikeys = await this.apiService.getApis();
    console.log(apikeys[0]);
    apikeys[0].telegram_bot_token = this.encryptionService.decrypt(
      apikeys[0].telegram_bot_token,
    );
    apikeys[0].weather_api_key = this.encryptionService.decrypt(
      apikeys[0].weather_api_key,
    );
    apikeys[0].jwt_secret = this.encryptionService.decrypt(
      apikeys[0].jwt_secret,
    );

    return apikeys[0];
  }

  @Post()
  async updateApiKeys(
    @Body()
    updatedApiData: {
      id: string;
      telegram_bot_token: string;
      weather_api_key: string;
      jwt_secret: string;
    },
  ) {
    const { id, ...updatedApiKeys } = updatedApiData;

    for (const key in updatedApiKeys) {
      updatedApiKeys[key] = this.encryptionService.encrypt(updatedApiKeys[key]);
    }
    const newApiKeys = await this.apiService.updateApiKeys(id, updatedApiKeys);
    this.cacheService.setApiKeys(newApiKeys);
    return newApiKeys;
  }
}
