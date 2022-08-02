/* eslint-disable prettier/prettier */
import { TaskToCategoryEntity } from 'src/tasks/entity/taskToCategory.entity';
import { TaskEntity } from 'src/tasks/entity/task.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  Unique,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
@Unique(['name']) //Không trùng lặp name
export class CategoryEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({type:'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  //!ManyToMany: (Không dùng)
  // @ManyToMany(() => TaskEntity, (task: TaskEntity) => task.categories)
  // public tasks: TaskEntity[];
  //!Custom ManyToMany: (Dùng)
  @OneToMany(() => TaskToCategoryEntity, taskToCategory => taskToCategory.category,
    {nullable: true, eager: true, cascade: true})
  //!eager: true, Cascade: true để lưu vào database, dùng find sẽ hiển thị, còn QueryBuilder thì dùng LeftJoinAndSelect
  //Không onDelete: "CASCADE" thì Xóa Relation TaskToCategory Không Xóa luôn Category
  // @JoinColumn({ referencedColumnName: 'categoryId' })
  //!JoinColumn() (Chỉ được đặt 1 bên) dùng cho OneToOne, ManyToOne(Có thể bỏ qua)
  public taskToCategories: TaskToCategoryEntity[];
}
