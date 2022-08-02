import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserHighlightWords } from '../../user-highlight/entities/user-highlight-word.entity';
import { Level } from '../../level/entities/level.entity';
import { AudioHighlightWords } from './audio-highlight-words.entity';
import { AudioThumbnail } from './audio-thumbnail.entity';
import { AudioTranscript } from './audio-transcript.entity';
import { AudioTypes } from './audio-types.entity';
import { AudiosToTopics } from './audios-to-topics.entity';

@Entity('audios')
export class Audio extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'audio_code', unique: true })
  audioCode: string;

  @Column({ name: 'audio_type_key' })
  audioTypeKey: string;

  @ManyToOne(() => AudioTypes, (audioTypes) => audioTypes.audios)
  @JoinColumn({ name: 'audio_type_key' })
  audioType: AudioTypes;

  @Column()
  title: string;

  @Column()
  desc: string;

  @OneToOne(() => AudioThumbnail, (audioThumbnail) => audioThumbnail.audio)
  audioThumbnail: AudioThumbnail;

  @OneToMany(() => AudioTranscript, (audioTranscript) => audioTranscript.audio)
  audioTranscripts: AudioTranscript[];

  // Join user_highlight_words
  @OneToMany(
    () => UserHighlightWords,
    (userHighlightWord) => userHighlightWord.audio,
    { cascade: ['insert'] },
  )
  userHighlightWords: UserHighlightWords[];
  // End join user_highlight_words

  // Join audio_highlight_words
  @OneToMany(
    () => AudioHighlightWords,
    (audioHighlightWords) => audioHighlightWords.audio,
    { cascade: ['insert'] },
  )
  audioHighlightWords: AudioHighlightWords[];
  // End join audio_highlight_words

  // Join audios_to_topics
  @OneToMany(() => AudiosToTopics, (audiosToTopics) => audiosToTopics.audio, {
    cascade: ['insert'],
  })
  audiosToTopics: AudiosToTopics[];
  // End join audios_to_topics

  // Join level
  @Column({ name: 'level_key' })
  levelKey: string;

  @ManyToOne(() => Level, (level) => level.audio)
  @JoinColumn({ name: 'level_key' })
  level: Level;
  // End join level
}
