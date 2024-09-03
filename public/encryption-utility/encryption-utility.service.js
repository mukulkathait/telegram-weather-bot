"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionUtilityService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let EncryptionUtilityService = class EncryptionUtilityService {
    constructor() {
        this.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
        this.IV_LENGTH = 16;
    }
    encrypt(text) {
        const iv = crypto.randomBytes(this.IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }
    decrypt(text) {
        const [iv, encryptedText] = text.split(':');
        const ivBuffer = Buffer.from(iv, 'hex');
        const encryptedBuffer = Buffer.from(encryptedText, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), ivBuffer);
        let decrypted = decipher.update(encryptedBuffer);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
};
exports.EncryptionUtilityService = EncryptionUtilityService;
exports.EncryptionUtilityService = EncryptionUtilityService = __decorate([
    (0, common_1.Injectable)()
], EncryptionUtilityService);
