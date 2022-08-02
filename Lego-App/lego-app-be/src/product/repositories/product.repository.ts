// import { CustomRepository } from '../../typeorm-repository/typeorm-ex.decorator';
import { EntityRepository, Repository, DataSource } from 'typeorm';
import { ProductEntity } from './../entities/product.entity';
import { Injectable } from '@nestjs/common';

// @EntityRepository(ProductEntity) //!Repository Custom 0.2 (Can't use)
// export class ProductRepository extends Repository<ProductEntity> {}

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
  //!Repository Custom TypeOrm 0.3:
  constructor(private dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }
}
