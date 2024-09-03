"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionUtilityModule = void 0;
const common_1 = require("@nestjs/common");
const encryption_utility_service_1 = require("./encryption-utility.service");
let EncryptionUtilityModule = class EncryptionUtilityModule {
};
exports.EncryptionUtilityModule = EncryptionUtilityModule;
exports.EncryptionUtilityModule = EncryptionUtilityModule = __decorate([
    (0, common_1.Module)({
        providers: [encryption_utility_service_1.EncryptionUtilityService],
        exports: [encryption_utility_service_1.EncryptionUtilityService],
    })
], EncryptionUtilityModule);
//# sourceMappingURL=encryption-utility.module.js.map