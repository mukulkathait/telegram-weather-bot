import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
export declare class AuthService {
    private readonly databaseService;
    private readonly jwtService;
    private oauthClient;
    constructor(databaseService: DatabaseService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    signup(email: string, password: string, username?: string): Promise<{
        access_token: string;
    }>;
    login(admin: any): Promise<{
        access_token: string;
    }>;
    validateGoogleUser({ googleId, email, avatarUrl, username, }: {
        googleId: string;
        email?: string;
        avatarUrl?: string;
        username?: string;
    }): Promise<any>;
    findUser(id: string): Promise<{
        access_token: string;
    }>;
    googleLogin(idToken: string): Promise<{
        access_token: string;
    }>;
}
