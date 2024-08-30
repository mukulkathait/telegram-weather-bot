import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [DatabaseModule],
  providers: [DatabaseService],
})
export class LocationModule {}
