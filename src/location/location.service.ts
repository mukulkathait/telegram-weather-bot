import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LocationService {
  constructor(private readonly databaseService: DatabaseService) {}

  createLocation(createLocationDto: Prisma.LocationCreateInput) {
    return this.databaseService.location.create({
      data: createLocationDto,
    });
  }

  updateLocation(updateLocationDto: Prisma.LocationUpdateInput, id: string) {
    return this.databaseService.location.update({
      where: {
        userId: id,
      },
      data: {
        longitude: updateLocationDto.longitude,
        latitude: updateLocationDto.latitude,
      },
    });
  }
}
