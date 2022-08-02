import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import {
  AudioThumbnailReq,
  AudioThumbnailUpdateReq,
} from '../dto/req/audio-thumnail-req.dto';
import { AudioThumbnail } from '../entities/audio-thumbnail.entity';

@EntityRepository(AudioThumbnail)
export class AudioThumbnailRepository extends Repository<AudioThumbnail> {
  async saveAudioThumbnail(
    @TransactionManager() transactionManager: EntityManager,
    savingAudioThumbnail: AudioThumbnailReq,
  ) {
    const createdAudioThumbnail = transactionManager.create(
      AudioThumbnail,
      savingAudioThumbnail,
    );
    return transactionManager.save(AudioThumbnail, createdAudioThumbnail);
  }

  async updateAudioThumbnail(
    @TransactionManager() transactionManager: EntityManager,
    updatingAudioThumbnail: AudioThumbnailUpdateReq,
  ) {
    return transactionManager.update(
      AudioThumbnail,
      updatingAudioThumbnail.id,
      updatingAudioThumbnail,
    );
  }
}
