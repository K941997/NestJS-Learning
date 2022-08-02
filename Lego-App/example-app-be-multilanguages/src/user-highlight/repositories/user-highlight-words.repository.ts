import { EntityRepository, Repository } from 'typeorm';
import { UserHighlightWords } from '../entities/user-highlight-word.entity';

@EntityRepository(UserHighlightWords)
export class UserHighlightWordsRepository extends Repository<UserHighlightWords> {}
