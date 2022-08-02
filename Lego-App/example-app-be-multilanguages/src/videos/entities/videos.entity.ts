import {
  AfterInsert,
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { NameConstraintEntity } from '../../common/constants/global.constant';
import { BaseEntity } from '../../common/entities/base.entity';
import { UserHighlightWords } from '../../user-highlight/entities/user-highlight-word.entity';
import { Level } from '../../level/entities/level.entity';
import { YoutubeVideoThumbnail } from '../dtos/common/base.dto';
import { generateYoutubeLink } from '../utils/helper.util';
import { VideoHighlightWords } from './video-highlight-words.entity';
import { VideoTranscripts } from './video-transcripts.entity';
import { VideoTypes } from './video-types.entity';
import { VideosToTopic } from './videos-to-topic.entity';

@Entity()
@Unique(NameConstraintEntity.UQ_VIDEO_CODE, ['videoCode', 'deletedAt'])
export class Videos extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'video_code', length: '20' })
  videoCode: string;

  @Column({ length: '50' })
  name: string;

  @Column({ length: '250' })
  desc: string;

  @Column()
  length: number;

  @Column({ name: 'is_feature', default: false })
  isFeature: boolean;

  // TypeORM will convert object to jsonb when saving to db for us
  @Column({ type: 'jsonb' })
  thumbnails: YoutubeVideoThumbnail;

  // This field is used to generate link from video_code
  link?: string = '';
  @AfterLoad()
  @AfterInsert()
  generateLink() {
    // Maybe we will need to generate link per video types
    this.link = generateYoutubeLink(this.videoCode);
  }

  // Join video types
  @Column({ name: 'video_types_key', length: 30 })
  videoTypesKey: string;

  @ManyToOne(() => VideoTypes, (videoTypes) => videoTypes.videos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'video_types_key' })
  videosType: VideoTypes;
  // End join video types

  // Join video transcripts
  @OneToMany(
    () => VideoTranscripts,
    (videoTranscripts) => videoTranscripts.videos,
    { cascade: ['insert'] },
  )
  videoTranscripts: VideoTranscripts[];
  // End video transcripts

  // Join user_highlight_words
  @OneToMany(
    () => UserHighlightWords,
    (userHighlightWord) => userHighlightWord.video,
    { cascade: ['insert'] },
  )
  userHighlightWords: UserHighlightWords[];
  // End join user_highlight_words

  // Join videos_to_topic
  @OneToMany(() => VideosToTopic, (videosToTopic) => videosToTopic.video, {
    cascade: ['insert'],
  })
  videosToTopics: VideosToTopic[];
  // End join videos_to_topic

  // Join level
  @Column({ name: 'level_key' })
  levelKey: string;

  @ManyToOne(() => Level, (level) => level.video, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'level_key' })
  level: Level;
  // End join level

  // Join video_highlight_words
  @OneToMany(
    () => VideoHighlightWords,
    (videoHighlightWord) => videoHighlightWord.video,
    { cascade: ['insert'] },
  )
  videoHighlightWords: VideoHighlightWords[];
  // End join video_highlight_words
}
