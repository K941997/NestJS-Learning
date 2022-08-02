/* eslint-disable prettier/prettier */
import { UserEntity } from 'src/auth/entity/user.entity';
import { CategoryEntity } from 'src/categories/entity/category.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskToCategoryEntity } from './taskToCategory.entity';
import { TaskStatus } from '../taskStatus.enum';

@Entity()
export class TaskEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({nullable: true})
  status: TaskStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({nullable: true}) //!CASL Role + isCreator thay cho role
  isPublished: boolean; //xuất bản

  //todo: Tắt đi để test JoinColumn dự án PK -> PK
  // @Column() //!CASL Role + isCreator thay cho role
  // authorId: number;

  @ManyToOne(() => UserEntity, (author: UserEntity) => author.tasks, { eager: false, onDelete: "CASCADE"}) 
  //!eager: true + eager: false (chỉ 1 phía được eager:true, tự động hiển thị relation, ko cần find({relation: "authorId"})) 
  //!Cascade: true để lưu vào database
  //!eager: true (Chỉ đặt 1 bên) để lưu vào database, dùng find sẽ hiển thị, còn QueryBuilder thì dùng LeftJoinAndSelect
  //onDelete: "CASCADE" Xóa User Xóa luôn Task
  //onDelete: "SET NULL" Đặt authorId = null nếu xóa author
  //JoinColumn() (Chỉ được đặt 1 bên) dùng cho OneToOne, ManyToOne(Có thể bỏ qua)
  // @JoinColumn( 
  //   { name: "authorIdd", referencedColumnName: "id" }
  // )
  author: UserEntity; 

  //!ManyToMany: (Không dùng)
  // @ManyToMany(() => CategoryEntity, (category: CategoryEntity) => category.tasks, {nullable: true})
  // @JoinTable() //!JoinTable() (Chỉ được đặt 1 bên) dùng cho ManyToMany
  // public categories: CategoryEntity[];

  //!Custom ManyToMany: (Dùng)
  @OneToMany(() => TaskToCategoryEntity, taskToCategory => taskToCategory.task,
    {nullable: true,  eager: true, cascade: true})
    //!eager: true + eager: false (chỉ 1 phía được eager:true, tự động hiển thị relation, ko cần find({relation: "authorId"})) 
  //!Cascade, CASCADE để lưu vào database
  //!eager: true, Cascade: true để lưu vào database, dùng find sẽ hiển thị, còn QueryBuilder thì dùng LeftJoinAndSelect
  //!Không onDelete: "CASCADE" thì Xóa Relation TaskToCategory Không Xóa luôn Task
  //!JoinColumn() (Chỉ được đặt 1 bên) dùng cho OneToOne, ManyToOne(Có thể bỏ qua)
  // @JoinColumn({ referencedColumnName: 'taskId' })
  public taskToCategories: TaskToCategoryEntity[];

}


