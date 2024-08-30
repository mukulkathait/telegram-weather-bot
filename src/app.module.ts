import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { LocationService } from './location/location.service';
import { LocationModule } from './location/location.module';

@Module({
  imports: [BotModule, AdminModule, ConfigModule.forRoot({}), DatabaseModule, UsersModule, LocationModule],
  controllers: [AppController],
  providers: [AppService, LocationService],
})
export class AppModule {}
