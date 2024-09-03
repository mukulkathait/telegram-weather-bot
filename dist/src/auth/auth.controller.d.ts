import { AuthService } from './auth.service';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: Request): Promise<Express.User>;
    signup(req: {
        email: string;
        password: string;
        username?: string;
    }): Promise<{
        access_token: string;
    }>;
    googleAuthLogin(req: {
        idToken: string;
    }): Promise<{
        access_token: string;
    }>;
    googleLogin(req: Request): void;
    handleRedirect(req: Request): Express.User;
    getProfile(req: Request): Express.User;
    testing(req: Request): void;
}
