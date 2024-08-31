import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AdminService {
  constructor(private databaseService: DatabaseService) {}

  findOne(email: string): Promise<Admin | null> {
    return this.databaseService.admin.findFirst({
      where: {
        email,
      },
    });
  }
}
