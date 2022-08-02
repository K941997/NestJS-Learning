import {
  EntityManager,
  EntityRepository,
  Repository,
  TransactionManager,
} from 'typeorm';
import { AudioTranscript } from '../entities/audio-transcript.entity';

@EntityRepository(AudioTranscript)
export class AudioTranscriptRepository extends Repository<AudioTranscript> {
  // async saveAudioTranscript(
  //   @TransactionManager() transactionManager: EntityManager,
  //   savingAudioTranscript: AudioTranscript,
  // ) {
  //   const createdAudioTranscript = await
  // }
}
