/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesMongoDbController } from './categories-mongo-db.controller';
import { CategoriesMongoDbService } from './categories-mongo-db.service';
import { CategoryMongoRepository } from './categories-mongo-db.repository';
import { CategoryMongoDB, CategorySchema } from './schema/category.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CategoryMongoDB.name, schema: CategorySchema }], 'categories')], //!'Category' to Service
  controllers: [CategoriesMongoDbController],
  providers: [CategoriesMongoDbService, CategoryMongoRepository] //!provide cả Repository mới chạy được
})
export class CategoriesMongoDbModule {}
