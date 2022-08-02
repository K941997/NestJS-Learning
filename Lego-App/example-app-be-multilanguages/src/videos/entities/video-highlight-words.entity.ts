import {
  Column, Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { EvDict } from '../../dictionary/entities/ev_dict.entity';
import { Videos } from './videos.entity';

@Entity({ name: 'video_highlight_words' })
export class VideoHighlightWords extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Join videos
  @Column({ name: 'videos_id' })
  videoId: number;

  @ManyToOne(() => Videos, (videos) => videos.videoHighlightWords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'videos_id' })
  video: Videos;
  // End join videos

  // Join ev_dict
  @Column({ name: 'ev_dict_idx' })
  evDictId: number;

  @ManyToOne(() => EvDict, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ev_dict_idx' })
  evDict: EvDict;
  // End join ev_dict
}
