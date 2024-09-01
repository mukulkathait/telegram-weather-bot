import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req: { email: string; password: string }) {
    const admin = await this.authService.validateUser(req.email, req.password);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return this.authService.login(admin);
  }

  @Post('signup')
  async signup(
    @Body() req: { email: string; password: string; username?: string },
  ) {
    return this.authService.signup(req.email, req.password, req.username);
  }

  @Post('google-login')
  async googleLogin(@Body() req: { idToken: string }) {
    return this.authService.googleLogin(req.idToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
