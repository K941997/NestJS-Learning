import { EntityRepository, Repository, DataSource } from 'typeorm';
import { ProductToCategoryEntity } from '../entities/product-to-category.entity';
import { Injectable } from '@nestjs/common';

// @EntityRepository(ProductsToCategoriesEntity) //!Repository Custom 0.2 (Can't Use)
// export class ProductsToCategoriesRepository extends Repository<ProductsToCategoriesEntity> {}

@Injectable()
export class ProductToCategoryRepository extends Repository<ProductToCategoryEntity> {
  //!Repository Custom TypeOrm 0.3:
  constructor(private dataSource: DataSource) {
    super(ProductToCategoryEntity, dataSource.createEntityManager());
  }
}
