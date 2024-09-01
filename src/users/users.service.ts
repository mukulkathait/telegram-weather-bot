import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  createUser(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: {
        ...createUserDto,
        location: {
          create: {},
        },
      },
      include: {
        location: true,
      },
    });
  }

  getAllUsers() {
    return this.databaseService.user.findMany();
  }

  findOne(telegramId: string) {
    return this.databaseService.user.findFirst({
      where: {
        telegramId,
      },
      include: {
        location: true,
      },
    });
  }

  updateUser(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: {
        telegramId: id,
      },
      data: {
        ...updateUserDto,
      },
      include: {
        location: true,
      },
    });
  }

  updateUserWithLocation(
    id: string,
    updateUserDto: Prisma.UserUpdateInput,
    updateLocationDto: Prisma.LocationUpdateInput,
  ) {
    return this.databaseService.user.update({
      where: {
        telegramId: id,
      },
      data: {
        ...updateUserDto,
        location: {
          update: {
            ...updateLocationDto,
          },
        },
      },
      include: {
        location: true,
      },
    });
  }

  blockUser(id: string) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        isblocked: true,
      },
    });
  }

  unblockUser(id: string) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        isblocked: false,
      },
    });
  }

  deleteUser(id: string) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }
}
