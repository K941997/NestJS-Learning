import { EntityRepository, Repository } from 'typeorm';
import { AudioHighlightWords } from '../entities/audio-highlight-words.entity';

@EntityRepository(AudioHighlightWords)
export class AudioHighlightWordsRepository extends Repository<AudioHighlightWords> {}
