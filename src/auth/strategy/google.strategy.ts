import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { VerifiedCallback } from 'passport-jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log('Inside validate function at google.strategy.ts: ', profile);
    const email = profile.emails[0].value || '';
    const avatarUrl = profile.photos[0].value || '';

    const user = await this.authService.validateGoogleUser({
      googleId: profile.id,
      email,
      avatarUrl,
      username: profile.displayName,
    });

    return user || null;
  }
}
