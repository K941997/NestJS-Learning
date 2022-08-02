/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CategoryMongoDB, CategoryDocument } from './schema/category.schema';
import { Model, FilterQuery } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { CategoryMongoRepository } from './categories-mongo-db.repository';
import { UpdateCategoryMongoDto } from './dto/updateCategoryMongo.dto';
import { CreateCategoryMongoDto } from './dto/createCategoryMongo.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesMongoDbService {
    constructor(
        //todo: NoSQL lấy dữ liệu DB từ Repository, ko có typeorm hỗ trợ từ service
        private readonly categoryMongoRepository: CategoryMongoRepository
    ) {}

    async createCategory(createCategoryMongoDBDto: CreateCategoryMongoDto): Promise<CategoryMongoDB> {
        const newCategory =  await this.categoryMongoRepository.create(createCategoryMongoDBDto)
        return newCategory;
    }

    async getAllCategories(): Promise<CategoryMongoDB[]> {
        return this.categoryMongoRepository.findAll({});
    }

    async getOneCategoryById(_id: string): Promise<CategoryMongoDB> {
        return this.categoryMongoRepository.findOne( {_id} );
    } 

    async updateCategory(_id: string, updateCategoryMongoDBDto: UpdateCategoryMongoDto): Promise<CategoryMongoDB> {
        return this.categoryMongoRepository.update({ _id }, updateCategoryMongoDBDto)
    }

 
}
