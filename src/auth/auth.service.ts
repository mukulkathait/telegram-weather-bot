import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const admin = await this.databaseService.admin.findUnique({
      where: { email },
    });
    if (
      admin &&
      admin.password &&
      (await bcrypt.compare(pass, admin.password))
    ) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(admin: any) {
    const payload = { email: admin.email, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(googleId: string, email: string, avatarUrl?: string) {
    let admin = await this.databaseService.admin.findUnique({
      where: { googleId },
    });

    if (!admin) {
      admin = await this.databaseService.admin.create({
        data: {
          googleId,
          email,
          avatarUrl,
        },
      });
    }

    return this.login(admin);
  }

  async signup(email: string, password: string, username?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.databaseService.admin.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    return this.login(admin);
  }
}
