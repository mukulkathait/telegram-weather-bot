"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const api_controller_1 = require("./api.controller");
describe('ApiController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [api_controller_1.ApiController],
        }).compile();
        controller = module.get(api_controller_1.ApiController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
