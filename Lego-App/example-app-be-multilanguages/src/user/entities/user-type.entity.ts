import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserTypeKey } from '../../common/enums/global.enum';
import { User } from './user.entity';

@Entity('user_types')
export class UserType {
  @PrimaryColumn({ enum: UserTypeKey })
  key: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.userType)
  users: User[];
}
