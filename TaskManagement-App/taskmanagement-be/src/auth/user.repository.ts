/* eslint-disable prettier/prettier */
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';

//!Repository: (Custom Repository):
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
    //!không cần lấy dữ liệu Database ở đây vì typeorm đã hỗ trợ Repository ở Service
}
