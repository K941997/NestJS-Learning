import { EntityRepository, Repository } from 'typeorm';
import { TopicTranslation } from '../entities/topic-translation.entity';

@EntityRepository(TopicTranslation)
export class TopicTranslationRepository extends Repository<TopicTranslation> {}
