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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const database_service_1 = require("../database/database.service");
const google_auth_library_1 = require("google-auth-library");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(databaseService, jwtService) {
        this.databaseService = databaseService;
        this.jwtService = jwtService;
        this.oauthClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    async validateUser(email, pass) {
        const admin = await this.databaseService.admin.findUnique({
            where: { email },
        });
        if (admin &&
            admin.password &&
            (await bcrypt.compare(pass, admin.password))) {
            const { password, ...result } = admin;
            return this.login(result);
        }
        return null;
    }
    async signup(email, password, username) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await this.databaseService.admin.create({
            data: {
                email,
                password: hashedPassword,
                username,
            },
        });
        return this.login(admin);
    }
    async login(admin) {
        const payload = { email: admin.email, sub: admin.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async validateGoogleUser({ googleId, email, avatarUrl, username, }) {
        let admin = await this.databaseService.admin.findUnique({
            where: {
                googleId,
            },
        });
        if (!admin) {
            admin = await this.databaseService.admin.create({
                data: {
                    googleId,
                    email,
                    avatarUrl,
                    username,
                },
            });
        }
        return this.login(admin);
    }
    async findUser(id) {
        const admin = await this.databaseService.admin.findFirst({
            where: {
                id,
            },
        });
        return this.login(admin);
    }
    async googleLogin(idToken) {
        const ticket = await this.oauthClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, picture: avatarUrl, given_name: username, } = payload;
        let admin = await this.databaseService.admin.findUnique({
            where: { googleId },
        });
        if (!admin) {
            admin = await this.databaseService.admin.create({
                data: {
                    googleId,
                    email,
                    avatarUrl,
                    username,
                },
            });
        }
        return this.login(admin);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService])
], AuthService);
