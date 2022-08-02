import { EntityRepository, Repository } from 'typeorm';
import { LevelTranslation } from '../entities/level-translation.entity';

@EntityRepository(LevelTranslation)
export class LevelTranslationRepository extends Repository<LevelTranslation> {}
