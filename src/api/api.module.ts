import { forwardRef, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { DatabaseModule } from 'src/database/database.module';
import { EncryptionUtilityModule } from 'src/encryption-utility/encryption-utility.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    DatabaseModule,
    EncryptionUtilityModule,
    forwardRef(() => CacheModule),
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
