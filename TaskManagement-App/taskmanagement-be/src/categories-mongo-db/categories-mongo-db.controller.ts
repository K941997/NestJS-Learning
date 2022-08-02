/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UpdateCategoryMongoDto } from './dto/updateCategoryMongo.dto';
import { CategoriesMongoDbService } from './categories-mongo-db.service';
import { CreateCategoryMongoDto } from './dto/createCategoryMongo.dto';
import { CategoryMongoDB } from './schema/category.schema';

@Controller('categories-mongo-db')
export class CategoriesMongoDbController {
    constructor(private readonly categoriesMongoDbService: CategoriesMongoDbService) {
    }

   @Post()
   async createCategory (
       @Body() createCategoryMongoDBDto: CreateCategoryMongoDto
   ): Promise<CategoryMongoDB> {
       return this.categoriesMongoDbService.createCategory(createCategoryMongoDBDto)
   }

   @Get()
   async getAllCategories(): Promise<CategoryMongoDB[]> {
       return this.categoriesMongoDbService.getAllCategories()
   }

   @Get(':_id')
   async getOneCategoryById(
       @Param('_id') _id: string
   ): Promise<CategoryMongoDB> {
       return this.categoriesMongoDbService.getOneCategoryById( _id );
   }

   @Patch(':_id')
   async updateCategory(
       @Param('_id') _id: string,
       @Body() updateCategoryMongoDBDto: UpdateCategoryMongoDto
   ): Promise<CategoryMongoDB> {
       return this.categoriesMongoDbService.updateCategory(_id, updateCategoryMongoDBDto)
   }

}
