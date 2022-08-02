import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { IAudioTranscriptWord } from '../interfaces/audio-transcript-content.interface';
import { Audio } from './audio.entity';

@Entity('audio_transcripts')
export class AudioTranscript extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  content: IAudioTranscriptWord[];

  @Column({ name: 'start_time', type: 'float' })
  startTime: number;

  @Column({ name: 'audio_id' })
  audioId: number;

  @ManyToOne(() => Audio, (audio) => audio.audioTranscripts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audio_id' })
  audio: Audio;
}
