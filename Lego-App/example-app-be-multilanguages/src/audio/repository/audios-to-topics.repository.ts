import { EntityRepository, Repository } from 'typeorm';
import { AudiosToTopics } from '../entities/audios-to-topics.entity';

@EntityRepository(AudiosToTopics)
export class AudiosToTopicsRepository extends Repository<AudiosToTopics> {}
