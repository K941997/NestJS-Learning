import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesMongoDbService } from './categories-mongo-db.service';

describe('CategoriesMongoDbService', () => {
  let service: CategoriesMongoDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesMongoDbService],
    }).compile();

    service = module.get<CategoriesMongoDbService>(CategoriesMongoDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
