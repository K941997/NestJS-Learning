import { EntityRepository, Repository } from 'typeorm';
import { VideoHighlightWords } from '../entities/video-highlight-words.entity';

@EntityRepository(VideoHighlightWords)
export class VideoHighlightWordsRepository extends Repository<VideoHighlightWords> {}
