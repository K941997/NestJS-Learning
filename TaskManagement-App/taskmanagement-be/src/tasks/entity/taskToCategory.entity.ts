/* eslint-disable prettier/prettier */
import { CategoryEntity } from "src/categories/entity/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskEntity } from "./task.entity";

//!Custom Relation ManyToMany:
@Entity()
export class TaskToCategoryEntity {
    @PrimaryGeneratedColumn()
    public taskToCategoryId: number

    @Column({nullable: true})
    public taskId: number

    @Column({nullable: true})
    public categoryId: number
    
    @ManyToOne(() => TaskEntity, (task) => task.taskToCategories, {onDelete: "CASCADE"})
    //!{onDelete: "CASCADE"}: Xóa Task Xóa luôn Relation TaskToCategory
    // @JoinColumn({name: 'taskId'})
    public task: TaskEntity

    @ManyToOne(() => CategoryEntity, (category) => category.taskToCategories, {onDelete: "CASCADE"})
    //!{onDelete: "CASCADE"}: Xóa Category Xóa luôn Relation TaskToCategory
    // @JoinColumn({name: 'categoryId'})
    public category: CategoryEntity
}