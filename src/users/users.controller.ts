import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findOne(@Body() telegramId: string) {
    return this.userService.findOne(telegramId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.userService.getAllUsers();
  }

  @Patch('block/:id')
  @UseGuards(JwtAuthGuard)
  blockUser(@Param('id') id: string, @Req() req: Request) {
    return this.userService.blockUser(id);
  }

  @Patch('unblock/:id')
  @UseGuards(JwtAuthGuard)
  unblockUser(@Param('id') id: string) {
    return this.userService.unblockUser(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
