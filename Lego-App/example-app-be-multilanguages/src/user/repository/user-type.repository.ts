import { EntityRepository, Repository } from 'typeorm';
import { UserType } from '../entities/user-type.entity';

@EntityRepository(UserType)
export class UserTypeRepository extends Repository<UserType> {}
