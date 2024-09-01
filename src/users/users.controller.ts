import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findOne(@Body() telegramId: string) {
    return this.userService.findOne(telegramId);
  }

  @Get('all')
  async findAll() {
    return this.userService.getAllUsers();
  }

  @Patch('block/:id')
  blockUser(@Param('id') id: string) {
    return this.userService.blockUser(id);
  }

  @Patch('unblock/:id')
  unblockUser(@Param('id') id: string) {
    return this.userService.unblockUser(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
