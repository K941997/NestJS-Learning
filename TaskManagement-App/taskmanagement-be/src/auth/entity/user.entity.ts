/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { TaskEntity } from 'src/tasks/entity/task.entity';
import { Role } from '../role/role.enum';
import Address from './address.entity';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['username']) //Không trùng lặp username
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true}) //!Firebase Login FB, Gmail:
  firId: string;

  @Column({nullable: true}) //!Vì signUp signIn chỉ lấy DTO username password nên UserEntity phải nullable:true
  name: string;

  // @Column({nullable: true}) //!Vì signUp signIn chỉ lấy DTO username password nên UserEntity phải nullable:true
  // address: string;

  @Column({type: 'enum', enum: Role, default: Role.USER}) //!CASL
  role: Role

  @Column({nullable: true}) //!CASL
  isAdmin: boolean;

  @Column()
  username: string;

  @Column({nullable: true})
  email: string; //test Firebase

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    nullable: true
  })
  @Exclude() //Trả về nhưng ko hiển thị
  public currentHashedRefreshToken?: string;

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.author, { eager: false, cascade: true })
  //!eager: true + eager: false (chỉ 1 phía được eager:true, tự động hiển thị relation, ko cần find({relation: "authorId"})) 
  //!Cascade, CASCADE để lưu vào database
  //!eager: true (Chỉ đặt 1 bên) để lưu vào database, dùng find sẽ hiển thị, còn QueryBuilder thì dùng LeftJoinAndSelect
  tasks: TaskEntity[];

  @OneToOne(() => Address, {nullable: true, eager: true, cascade: true})
  @JoinColumn( 
    { name: "address_id", referencedColumnName: "id" }
  )
  //!eager: true + eager: false (chỉ 1 phía được eager:true, tự động hiển thị relation, ko cần find({relation: "authorId"})) 
  //!Cascade, CASCADE để lưu vào database
  //!eager: true (Chỉ đặt 1 bên) để lưu vào database, dùng find sẽ hiển thị, còn QueryBuilder thì dùng LeftJoinAndSelect
  //!JoinColumn() (Chỉ được đặt 1 bên) dùng cho OneToOne, ManyToOne(Có thể bỏ qua)
  address: Address;



}
