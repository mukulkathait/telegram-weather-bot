import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ApiService {
  constructor(private readonly databaseService: DatabaseService) {}

  getApis() {
    return this.databaseService.apis.findMany();
  }

  updateApiKeys(id: string, updatedApiKeys: Prisma.ApisUpdateInput) {
    return this.databaseService.apis.update({
      where: {
        id,
      },
      data: {
        ...updatedApiKeys,
      },
    });
  }
}
