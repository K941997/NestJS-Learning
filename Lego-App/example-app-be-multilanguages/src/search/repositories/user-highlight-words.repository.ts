import { EntityRepository, Repository } from 'typeorm';
import { UserSearchs } from '../entities/user-searchs.entity';

@EntityRepository(UserSearchs)
export class UserSearchsRepository extends Repository<UserSearchs> {}
