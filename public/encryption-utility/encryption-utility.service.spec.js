"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const encryption_utility_service_1 = require("./encryption-utility.service");
describe('EncryptionUtilityService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [encryption_utility_service_1.EncryptionUtilityService],
        }).compile();
        service = module.get(encryption_utility_service_1.EncryptionUtilityService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
