import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
export declare class LocationService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    createLocation(createLocationDto: Prisma.LocationCreateInput): Prisma.Prisma__LocationClient<{
        id: string;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateLocation(updateLocationDto: Prisma.LocationUpdateInput, id: string): Prisma.Prisma__LocationClient<{
        id: string;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
