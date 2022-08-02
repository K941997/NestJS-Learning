import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { TimestampWithoutSoftDeleteEntity } from '../../common/entities/base.entity';
import { Topic } from '../../topic/entities/topic.entity';
import { User } from './user.entity';

@Entity('user_to_topics')
export class UserToTopics extends TimestampWithoutSoftDeleteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Join user
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.userToTopics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
  // End join user

  // Join topic
  @Column({name: 'topic_key'})
  topicKey: string

  @ManyToOne(() => Topic, topic => topic.userToTopics, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'topic_key'})
  topic: Topic
  // End join topic
}
