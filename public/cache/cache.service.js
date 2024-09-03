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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("../api/api.service");
const encryption_utility_service_1 = require("../encryption-utility/encryption-utility.service");
let CacheService = class CacheService {
    constructor(apiService, encryptionService) {
        this.apiService = apiService;
        this.encryptionService = encryptionService;
        this.apiKeys = null;
    }
    async getApiKeys() {
        if (!this.apiKeys) {
            const apiKeysResponse = await this.apiService.getApis();
            (apiKeysResponse[0].telegram_bot_token = this.encryptionService.decrypt(apiKeysResponse[0].telegram_bot_token)),
                (apiKeysResponse[0].weather_api_key = this.encryptionService.decrypt(apiKeysResponse[0].weather_api_key)),
                (apiKeysResponse[0].jwt_secret = this.encryptionService.decrypt(apiKeysResponse[0].jwt_secret)),
                (this.apiKeys = apiKeysResponse[0]);
        }
        return this.apiKeys;
    }
    async getJwtSecret() {
        const keys = await this.getApiKeys();
        return keys.jwt_secret;
    }
    async getBotToken() {
        const keys = await this.getApiKeys();
        return keys.telegram_bot_token;
    }
    async getWeatherApiKey() {
        const keys = await this.getApiKeys();
        return keys.weather_api_key;
    }
    setApiKeys(apiKeys) {
        this.apiKeys = apiKeys;
    }
    clearCache() {
        this.apiKeys = null;
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => api_service_1.ApiService))),
    __metadata("design:paramtypes", [api_service_1.ApiService,
        encryption_utility_service_1.EncryptionUtilityService])
], CacheService);
