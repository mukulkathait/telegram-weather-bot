"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bot_service_1 = require("./bot.service");
describe('BotService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [bot_service_1.BotService],
        }).compile();
        service = module.get(bot_service_1.BotService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
