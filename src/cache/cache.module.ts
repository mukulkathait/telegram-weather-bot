import { forwardRef, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [forwardRef(() => ApiModule)],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
