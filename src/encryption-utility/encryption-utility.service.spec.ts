import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionUtilityService } from './encryption-utility.service';

describe('EncryptionUtilityService', () => {
  let service: EncryptionUtilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionUtilityService],
    }).compile();

    service = module.get<EncryptionUtilityService>(EncryptionUtilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
