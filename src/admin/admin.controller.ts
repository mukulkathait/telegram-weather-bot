import { Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(): any {
    return {};
  }

  @Get('protected')
  getHello(): string {
    return 'Hello';
  }
}
