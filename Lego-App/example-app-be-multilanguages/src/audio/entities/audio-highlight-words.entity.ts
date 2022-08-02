import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreatedDateEntity } from '../../common/entities/base.entity';
import { EvDict } from '../../dictionary/entities/ev_dict.entity';
import { Audio } from './audio.entity';

@Entity({ name: 'audio_highlight_words' })
export class AudioHighlightWords extends CreatedDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Join audio_transcript
  @Column({ name: 'audio_id' })
  audioId: number;

  @ManyToOne(() => Audio, (audio) => audio.audioHighlightWords)
  @JoinColumn({ name: 'audio_id' })
  audio: Audio;
  // End join audio_transcript

  // Join ev_dict
  @Column({ name: 'ev_dict_idx' })
  evDictId: number;

  @ManyToOne(() => EvDict)
  @JoinColumn({ name: 'ev_dict_idx' })
  evDict: EvDict;
  // End join ev_dict
}
