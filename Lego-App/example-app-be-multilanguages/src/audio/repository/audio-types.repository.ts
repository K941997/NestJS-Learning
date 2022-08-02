import { EntityRepository, Repository } from 'typeorm';
import { AudioTypes } from '../entities/audio-types.entity';

@EntityRepository(AudioTypes)
export class AudioTypesRepository extends Repository<AudioTypes> {}
