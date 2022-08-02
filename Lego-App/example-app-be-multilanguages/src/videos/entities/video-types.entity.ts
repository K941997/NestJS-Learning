import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Videos } from './videos.entity';

@Entity({ name: 'video_types' })
export class VideoTypes extends BaseEntity {
  @PrimaryColumn({ length: '30' })
  key: string;

  @Column({ length: '255' })
  desc: string;

  @OneToMany(() => Videos, (videos) => videos.videosType, {
    cascade: ['insert'],
  })
  videos: Videos[];
}
