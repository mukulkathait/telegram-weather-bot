import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from 'src/users/users.service';
import { LocationService } from 'src/location/location.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [BotService, UsersService, LocationService],
})
export class BotModule {}
