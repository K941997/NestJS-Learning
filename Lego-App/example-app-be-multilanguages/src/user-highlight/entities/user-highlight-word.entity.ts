import {
  BeforeInsert,
  BeforeUpdate,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Audio } from '../../audio/entities/audio.entity';
import { NameConstraintEntity } from '../../common/constants/global.constant';
import {
  CreatedDateEntity,
  TimestampWithoutSoftDeleteEntity,
} from '../../common/entities/base.entity';
import {
  MediaType,
} from '../../common/enums/global.enum';
import { EvDict } from '../../dictionary/entities/ev_dict.entity';
import { User } from '../../user/entities/user.entity';
import { Videos } from '../../videos/entities/videos.entity';

@Entity({ name: 'user_highlight_words' })
@Check(
  NameConstraintEntity.CHECK_USER_HIGHLIGHT_WORDS,
  `
  (
    COALESCE((video_id)::BOOLEAN::INTEGER, 0)
    +
    COALESCE((audio_id)::BOOLEAN::INTEGER, 0)
  ) = 1
`,
)
@Unique(NameConstraintEntity.UQ_USER_HIGHLIGHT_WORDS, [
  'userId',
  'videoId',
  'evDictId',
  'audioId',
])
export class UserHighlightWords extends CreatedDateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Join user
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.userHighlightWords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
  // End join user

  // Join evdict
  @Column({ name: 'ev_dict_idx' })
  evDictId: number;

  @ManyToOne(() => EvDict, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ev_dict_idx' })
  evDict: EvDict;
  // End join evdict

  // Join video
  @Column({ name: 'video_id', nullable: true })
  videoId: number;

  @ManyToOne(() => Videos, (video) => video.userHighlightWords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'video_id' })
  video: Videos;
  // End join video

  // Join audio
  @Column({ name: 'audio_id', nullable: true })
  audioId: number;

  @ManyToOne(() => Audio, (audio) => audio.userHighlightWords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audio_id' })
  audio: Audio;
  // End join audio

  @Column({ name: 'media_type', type: 'enum', enum: MediaType })
  mediaType: MediaType;
}
