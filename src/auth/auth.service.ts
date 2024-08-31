import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(private adminService: AdminService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.adminService.findOne(email);

    if (user && user.password === password) {
      const { password, email, ...restData } = user;
      return restData;
    }

    return null;
  }
}
