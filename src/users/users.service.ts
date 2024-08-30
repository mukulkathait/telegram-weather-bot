import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  createUser(createUserDto: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: createUserDto,
      include: {
        location: true,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(telegramId: string) {
    return this.databaseService.user.findUnique({
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
