"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const api_service_1 = require("./api.service");
describe('ApiService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [api_service_1.ApiService],
        }).compile();
        service = module.get(api_service_1.ApiService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
