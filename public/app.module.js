"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const bot_module_1 = require("./bot/bot.module");
const config_1 = require("@nestjs/config");
const database_module_1 = require("./database/database.module");
const users_module_1 = require("./users/users.module");
const location_module_1 = require("./location/location.module");
const auth_module_1 = require("./auth/auth.module");
const api_module_1 = require("./api/api.module");
const encryption_utility_service_1 = require("./encryption-utility/encryption-utility.service");
const encryption_utility_module_1 = require("./encryption-utility/encryption-utility.module");
const cache_service_1 = require("./cache/cache.service");
const cache_module_1 = require("./cache/cache.module");
const passport_1 = require("@nestjs/passport");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({}),
            database_module_1.DatabaseModule,
            bot_module_1.BotModule,
            users_module_1.UsersModule,
            location_module_1.LocationModule,
            auth_module_1.AuthModule,
            api_module_1.ApiModule,
            encryption_utility_module_1.EncryptionUtilityModule,
            cache_module_1.CacheModule,
            passport_1.PassportModule.register({ session: true }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            encryption_utility_service_1.EncryptionUtilityService,
            cache_service_1.CacheService,
        ],
    })
], AppModule);
