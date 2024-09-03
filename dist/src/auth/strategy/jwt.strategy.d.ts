import { Strategy } from 'passport-jwt';
import { DatabaseService } from '../../database/database.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    validate(payload: any): Promise<{
        id: string;
        email: string;
    }>;
}
export {};
