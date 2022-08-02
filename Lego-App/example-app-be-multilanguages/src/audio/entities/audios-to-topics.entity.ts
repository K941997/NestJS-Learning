import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Topic } from '../../topic/entities/topic.entity';
import { Audio } from './audio.entity';
import { BaseEntity } from './../../common/entities/base.entity';

@Entity({ name: 'audios_to_topics' })
export class AudiosToTopics extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Join topic
  @Column({ name: 'topic_key' })
  topicKey: string;

  @ManyToOne(() => Topic, (topic) => topic.audiosToTopics)
  @JoinColumn({ name: 'topic_key' })
  topic: Topic;
  // End join topic

  // Join audios
  @Column({ name: 'audio_id' })
  audioId: number;

  @ManyToOne(() => Audio, (audio) => audio.audiosToTopics, {
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: 'audio_id' })
  audio: Audio;
  // End join audios
}
