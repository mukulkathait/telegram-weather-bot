import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
export declare class ApiService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    getApis(): Prisma.PrismaPromise<{
        id: string;
        telegram_bot_token: string;
        weather_api_key: string;
        jwt_secret: string;
        updatedAt: Date;
    }[]>;
    updateApiKeys(id: string, updatedApiKeys: Prisma.ApisUpdateInput): Prisma.Prisma__ApisClient<{
        id: string;
        telegram_bot_token: string;
        weather_api_key: string;
        jwt_secret: string;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
