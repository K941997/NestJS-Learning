import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { SavedAudio } from '../dto/res/audio.dto';
import { Audio } from '../entities/audio.entity';

@EntityRepository(Audio)
export class AudioRepository extends Repository<Audio> {
  async saveAudio(
    @TransactionManager() transactionManager: EntityManager,
    savingAudio: Omit<SavedAudio, 'id'>,
  ) {
    const createdAudio = transactionManager.create(Audio, savingAudio);
    return transactionManager.save(Audio, createdAudio);
  }

  async updateAudio(
    @TransactionManager() transactionManager: EntityManager,
    updatingAudio: SavedAudio,
  ) {
    return transactionManager.save(updatingAudio);
  }
}
