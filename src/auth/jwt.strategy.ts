import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const admin = await this.databaseService.admin.findUnique({
      where: { id: payload.sub },
    });
    if (!admin) {
      throw new UnauthorizedException();
    }
    return { id: admin.id, email: admin.email };
  }
}
