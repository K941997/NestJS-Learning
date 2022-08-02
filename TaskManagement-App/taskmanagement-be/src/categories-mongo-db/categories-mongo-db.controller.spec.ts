/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesMongoDbController } from './categories-mongo-db.controller';

describe('CategoriesMongoDbController', () => {
  let controller: CategoriesMongoDbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesMongoDbController],
    }).compile();

    controller = module.get<CategoriesMongoDbController>(CategoriesMongoDbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
