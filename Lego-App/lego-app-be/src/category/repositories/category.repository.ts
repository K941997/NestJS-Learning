import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository, DataSource } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';

// @EntityRepository(CategoryEntity)
// export class CategoryRepository extends Repository<CategoryEntity> {}

@Injectable()
export class CategoryRepository extends Repository<CategoryEntity> {
  //Repository Custom TypeOrm 0.3.0:
  constructor(private dataSource: DataSource) {
    super(CategoryEntity, dataSource.createEntityManager());
  }
}
