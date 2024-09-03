import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
export declare class UsersService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    createUser(createUserDto: Prisma.UserCreateInput): Prisma.Prisma__UserClient<{
        location: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            userId: string;
        };
    } & {
        id: string;
        telegramId: string;
        firstName: string | null;
        username: string | null;
        isSubscribed: boolean;
        subscribedAt: Date;
        preferredTime: string | null;
        languageCode: string | null;
        isNotified: boolean;
        isblocked: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getAllUsers(): Prisma.PrismaPromise<({
        location: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            userId: string;
        };
    } & {
        id: string;
        telegramId: string;
        firstName: string | null;
        username: string | null;
        isSubscribed: boolean;
        subscribedAt: Date;
        preferredTime: string | null;
        languageCode: string | null;
        isNotified: boolean;
        isblocked: boolean;
    })[]>;
    findOne(telegramId: string): Prisma.Prisma__UserClient<{
        location: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            userId: string;
        };
    } & {
        id: string;
        telegramId: string;
        firstName: string | null;
        username: string | null;
        isSubscribed: boolean;
        subscribedAt: Date;
        preferredTime: string | null;
        languageCode: string | null;
        isNotified: boolean;
        isblocked: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    updateUser(id: string, updateUserDto: Prisma.UserUpdateInput): Prisma.Prisma__UserClient<{
        location: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            userId: string;
        };
    } & {
        id: string;
        telegramId: string;
        firstName: string | null;
        username: string | null;
        isSubscribed: boolean;
        subscribedAt: Date;
        preferredTime: string | null;
        languageCode: string | null;
        isNotified: boolean;
        isblocked: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateUserWithLocation(id: string, updateUserDto: Prisma.UserUpdateInput, updateLocationDto: Prisma.LocationUpdateInput): Prisma.Prisma__UserClient<{
        location: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            userId: string;
        };
    } & {
        id: string;
        telegramId: string;
        firstName: string | null;
        username: string | null;
        isSubscribed: boolean;
        subscribedAt: Date;
        preferredTime: string | null;
        languageCode: string | null;
        isNotified: boolean;
        isblocked: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    blockUser(id: string): Prisma.Prisma__UserClient<{
        id: string;
        telegramId: string;
        firstName: string | null;
        username: string | null;
        isSubscribed: boolean;
        subscribedAt: Date;
        preferredTime: string | null;
        languageCode: string | null;
        isNotified: boolean;
        isblocked: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    unblockUser(id: string): Prisma.Prisma__UserClient<{
        id: string;
        telegramId: string;
        firstName: string | null;
        username: string | null;
        isSubscribed: boolean;
        subscribedAt: Date;
        preferredTime: string | null;
        languageCode: string | null;
        isNotified: boolean;
        isblocked: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteUser(id: string): Prisma.Prisma__UserClient<{
        id: string;
        telegramId: string;
        firstName: string | null;
        username: string | null;
        isSubscribed: boolean;
        subscribedAt: Date;
        preferredTime: string | null;
        languageCode: string | null;
        isNotified: boolean;
        isblocked: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
