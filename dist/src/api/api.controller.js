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
exports.ApiController = void 0;
const common_1 = require("@nestjs/common");
const api_service_1 = require("./api.service");
const encryption_utility_service_1 = require("../encryption-utility/encryption-utility.service");
const cache_service_1 = require("../cache/cache.service");
let ApiController = class ApiController {
    constructor(apiService, encryptionService, cacheService) {
        this.apiService = apiService;
        this.encryptionService = encryptionService;
        this.cacheService = cacheService;
    }
    async getAllKeys() {
        const apikeys = await this.apiService.getApis();
        apikeys[0].telegram_bot_token = this.encryptionService.decrypt(apikeys[0].telegram_bot_token);
        apikeys[0].weather_api_key = this.encryptionService.decrypt(apikeys[0].weather_api_key);
        apikeys[0].jwt_secret = this.encryptionService.decrypt(apikeys[0].jwt_secret);
        return apikeys[0];
    }
    async updateApiKeys(updatedApiData) {
        const { id, ...updatedApiKeys } = updatedApiData;
        for (const key in updatedApiKeys) {
            updatedApiKeys[key] = this.encryptionService.encrypt(updatedApiKeys[key]);
        }
        const newApiKeys = await this.apiService.updateApiKeys(id, updatedApiKeys);
        this.cacheService.setApiKeys(newApiKeys);
        return newApiKeys;
    }
};
exports.ApiController = ApiController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "getAllKeys", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "updateApiKeys", null);
exports.ApiController = ApiController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [api_service_1.ApiService,
        encryption_utility_service_1.EncryptionUtilityService,
        cache_service_1.CacheService])
], ApiController);
//# sourceMappingURL=api.controller.js.map