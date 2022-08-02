/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// import {
//     BaseEntity,
//     Column,
//     Entity,
//     JoinColumn,
//     OneToOne,
//     PrimaryGeneratedColumn,
//   } from 'typeorm';
// import { UserEntity } from './user.entity';
  
 
//   @Entity()
//   export class Info extends BaseEntity {
//     @PrimaryGeneratedColumn()
//     id: number;
  
//     @Column({nullable: true})
//     phone: string;

//     @Column({nullable: true})
//     email: string

//     @Column({type:'timestamp', default: () => 'CURRENT_TIMESTAMP'})
//     createdAt: Date;

//     @Column()
//     userId: number;
//     @OneToOne(() => UserEntity, user => user.info, {onDelete: 'CASCADE'}) //!Xóa User xóa luôn Info
//     @JoinColumn()
//     user: UserEntity;

  
//   }
  