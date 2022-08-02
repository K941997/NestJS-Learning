/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CategoryMongoDB, CategoryDocument } from "./schema/category.schema";
import { Model, FilterQuery } from "mongoose";
import { CreateCategoryMongoDto } from "./dto/createCategoryMongo.dto";
 
@Injectable()
export class CategoryMongoRepository {
    //! NoSQL MongoDB phải có Repository riêng để lấy dữ liệu Database (Khác SQL TypeOrm):
    constructor(
        @InjectModel(CategoryMongoDB.name) //!'Category' from Module
        private categoryModel: Model<CategoryDocument> //!Inject Model MongoDB
    ) {}

    async create (createCategoryMongoDBDto: CreateCategoryMongoDto): Promise<CategoryMongoDB> {
        const newCategory = new this.categoryModel(createCategoryMongoDBDto);
        return newCategory.save()
    }

    async findAll(categoryFilterQuery: FilterQuery<CategoryMongoDB>): Promise<CategoryMongoDB[]> {
        return this.categoryModel.find(categoryFilterQuery)
    }

    async findOne(categoryFilterQuery: FilterQuery<CategoryMongoDB>): Promise<CategoryMongoDB> { //FilterQuery from 'mongoose'
        return this.categoryModel.findOne(categoryFilterQuery)
    }

    async update (categoryFilterQuery: FilterQuery<CategoryMongoDB>, category: Partial<CategoryMongoDB>): Promise<CategoryMongoDB> {
        return this.categoryModel.findOneAndUpdate(categoryFilterQuery, category, { new: true }); //new: true để return cái mới nhất
    }
}