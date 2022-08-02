/* eslint-disable prettier/prettier */
//!Schema MongoDB like Entity PostgreSQL:
import { MongooseModule, Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";



export type CategoryDocument = CategoryMongoDB & Document;

@Schema()
export class CategoryMongoDB {
    @Prop({unique: true})
    name!: string;

    @Prop({ required: true })
    description: string;
    
    @Prop([String])
    favorites: string[];

    @Prop({default: Date.now})
    createdAt: Date

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) //Relation
    // user: User;

    // @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]}) //Relation
    // user: User[];

    // @Prop(raw({
    //     firstname: {type: String},
    //     lastname: { type: String }
    // }))
    // details: Record<string, any>

}



export const CategorySchema = SchemaFactory.createForClass(CategoryMongoDB);