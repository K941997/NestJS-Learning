/* eslint-disable prettier/prettier */
import { UserEntity } from "src/auth/entity/user.entity";
import { TaskStatus } from "../taskStatus.enum";
import { TaskToCategoryEntity } from "./taskToCategory.entity";

/* eslint-disable prettier/prettier */
export interface TaskInterface {
    id?: number;
    title?: string;
    description?: string;
    status?: TaskStatus;
    createdAt?: Date;
    isPublished?: boolean; //xuất bản
    authorId?: number;
    author?: UserEntity; 
    taskToCategories?: TaskToCategoryEntity[];

    
}
