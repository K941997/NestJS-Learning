import { EntityRepository, Repository } from 'typeorm';
import { VideosToTopic } from '../entities/videos-to-topic.entity';

@EntityRepository(VideosToTopic)
export class VideosToTopicRepository extends Repository<VideosToTopic> {}
