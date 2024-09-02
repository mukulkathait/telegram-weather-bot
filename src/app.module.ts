import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/auth.module';
import { ApiModule } from './api/api.module';
import { EncryptionUtilityService } from './encryption-utility/encryption-utility.service';
import { EncryptionUtilityModule } from './encryption-utility/encryption-utility.module';
import { CacheService } from './cache/cache.service';
import { CacheModule } from './cache/cache.module';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './auth/strategy/serializer';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    DatabaseModule,
    BotModule,
    UsersModule,
    LocationModule,
    AuthModule,
    ApiModule,
    EncryptionUtilityModule,
    CacheModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EncryptionUtilityService,
    CacheService,
    // SessionSerializer,
  ],
})
export class AppModule {}
