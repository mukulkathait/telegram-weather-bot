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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let UsersService = class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    createUser(createUserDto) {
        return this.databaseService.user.create({
            data: {
                ...createUserDto,
                location: {
                    create: {},
                },
            },
            include: {
                location: true,
            },
        });
    }
    getAllUsers() {
        return this.databaseService.user.findMany({
            include: {
                location: true,
            },
        });
    }
    findOne(telegramId) {
        return this.databaseService.user.findFirst({
            where: {
                telegramId,
            },
            include: {
                location: true,
            },
        });
    }
    updateUser(id, updateUserDto) {
        return this.databaseService.user.update({
            where: {
                telegramId: id,
            },
            data: {
                ...updateUserDto,
            },
            include: {
                location: true,
            },
        });
    }
    updateUserWithLocation(id, updateUserDto, updateLocationDto) {
        return this.databaseService.user.update({
            where: {
                telegramId: id,
            },
            data: {
                ...updateUserDto,
                location: {
                    update: {
                        ...updateLocationDto,
                    },
                },
            },
            include: {
                location: true,
            },
        });
    }
    blockUser(id) {
        return this.databaseService.user.update({
            where: {
                id,
            },
            data: {
                isblocked: true,
            },
        });
    }
    unblockUser(id) {
        return this.databaseService.user.update({
            where: {
                id,
            },
            data: {
                isblocked: false,
            },
        });
    }
    deleteUser(id) {
        return this.databaseService.user.delete({
            where: {
                id,
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map