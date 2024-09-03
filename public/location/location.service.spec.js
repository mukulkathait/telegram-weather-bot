"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const location_service_1 = require("./location.service");
describe('LocationService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [location_service_1.LocationService],
        }).compile();
        service = module.get(location_service_1.LocationService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
