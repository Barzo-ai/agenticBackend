import { Test, TestingModule } from '@nestjs/testing';
import { JumiaService } from './jumia.service';

describe('JumiaService', () => {
  let service: JumiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JumiaService],
    }).compile();

    service = module.get<JumiaService>(JumiaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
