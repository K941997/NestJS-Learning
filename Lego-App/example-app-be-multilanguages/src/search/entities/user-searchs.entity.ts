import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ColumnDate } from '../../common/decorators/custom-column.decorator';
import { CreatedDateEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';


@Entity({ name: 'user_searchs' })
export class UserSearchs extends CreatedDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 100, unique: true})
  keyword: string

  @ColumnDate()
  searchTime: Date

  // Join user
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.userSearchs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
  // End join user
}
