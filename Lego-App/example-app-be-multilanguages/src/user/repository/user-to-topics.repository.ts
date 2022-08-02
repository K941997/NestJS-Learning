import { EntityRepository, Repository } from 'typeorm';
import { UserToTopics } from '../entities/user-to-topics.entity';

@EntityRepository(UserToTopics)
export class UserToTopicsRepository extends Repository<UserToTopics> {}
