import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    return req.user;
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

  @Get('testing')
  @UseGuards(JwtAuthGuard)
  testing(@Req() req: Request) {
    console.log('Inside authcontroller testing method');
    console.log(req.user);
  }
}
