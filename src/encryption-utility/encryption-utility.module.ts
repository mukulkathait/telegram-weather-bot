import { Module } from '@nestjs/common';
import { EncryptionUtilityService } from './encryption-utility.service';

@Module({
  providers: [EncryptionUtilityService],
  exports: [EncryptionUtilityService],
})
export class EncryptionUtilityModule {}
