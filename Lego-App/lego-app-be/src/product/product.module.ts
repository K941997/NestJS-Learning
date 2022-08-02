import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './repositories/product.repository';
import { ProductToCategoryRepository } from './repositories/product-to-category.repository';
import { ProductClientController } from './controllers/client/product-client.controller';
import { ProductAdminController } from './controllers/admin/product-admin.controller';
import { ProductClientService } from './services/client/product-client.service';
import { ProductAdminService } from './services/admin/product-admin.service';
// import { productProvider } from './repositories/providers/product.provider';
import { ProductEntity } from './entities/product.entity';
import { ProductToCategoryEntity } from './entities/product-to-category.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryRepository } from './../category/repositories/category.repository';
import { ThemeEntity } from './../theme/entities/theme.entity';
import { ThemeRepository } from '../theme/repositories/theme.repository';
import { ProductsFeaturedSets } from './controllers/client/products-featured-sets.controller';

// import { TypeOrmExModule } from '../typeorm-repository/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // ProductRepository,
      // ProductsToCategoriesRepository,
      // CategoryRepository,
      ProductEntity,
      ProductToCategoryEntity,
      CategoryEntity,
      ThemeEntity,
    ]),
  ],

  controllers: [
    ProductAdminController,
    ProductClientController,
    ProductsFeaturedSets,
  ],
  providers: [
    ProductAdminService,
    ProductClientService,
    ProductRepository,
    ProductToCategoryRepository,
    CategoryRepository,
    ThemeRepository,
  ],
})
export class ProductModule {}
