import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Topic } from '../../topic/entities/topic.entity';
import { Videos } from './videos.entity';

@Entity({ name: 'videos_to_topic' })
export class VideosToTopic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Join topic
  @Column({ name: 'topic_key' })
  topicKey: string;

  @ManyToOne(() => Topic, (topic) => topic.videosToTopics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'topic_key' })
  topic: Topic;
  // End join topic

  // Join videos
  @Column({ name: 'videos_id' })
  videosId: number;

  @ManyToOne(() => Videos, (videos) => videos.videosToTopics, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'videos_id' })
  video: Videos;
  // End join videos
}
