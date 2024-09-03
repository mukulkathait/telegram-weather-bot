"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiModule = void 0;
const common_1 = require("@nestjs/common");
const api_controller_1 = require("./api.controller");
const api_service_1 = require("./api.service");
const database_module_1 = require("../database/database.module");
const encryption_utility_module_1 = require("../encryption-utility/encryption-utility.module");
const cache_module_1 = require("../cache/cache.module");
let ApiModule = class ApiModule {
};
exports.ApiModule = ApiModule;
exports.ApiModule = ApiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            encryption_utility_module_1.EncryptionUtilityModule,
            (0, common_1.forwardRef)(() => cache_module_1.CacheModule),
        ],
        controllers: [api_controller_1.ApiController],
        providers: [api_service_1.ApiService],
        exports: [api_service_1.ApiService],
    })
], ApiModule);
