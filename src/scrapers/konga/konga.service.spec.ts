import { Test, TestingModule } from '@nestjs/testing';
import { KongaService } from './konga.service';

describe('KongaService', () => {
  let service: KongaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KongaService],
    }).compile();

    service = module.get<KongaService>(KongaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
