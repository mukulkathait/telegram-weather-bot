import { forwardRef, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ApiModule } from 'src/api/api.module';
import { EncryptionUtilityModule } from 'src/encryption-utility/encryption-utility.module';

@Module({
  imports: [forwardRef(() => ApiModule), EncryptionUtilityModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
