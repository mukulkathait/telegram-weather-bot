import { UsersService } from './users.service';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    findOne(telegramId: string): Promise<{
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
    }>;
    findAll(): Promise<({
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
    blockUser(id: string, req: Request): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    unblockUser(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    remove(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
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
