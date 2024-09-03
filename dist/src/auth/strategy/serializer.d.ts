import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Admin } from '@prisma/client';
export declare class SessionSerializer extends PassportSerializer {
    private authService;
    constructor(authService: AuthService);
    serializeUser(user: Admin, done: Function): void;
    deserializeUser(payload: Admin, done: Function): Promise<any>;
}
