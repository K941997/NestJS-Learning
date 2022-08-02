import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { VideoHighlightWords } from './video-highlight-words.entity';
import { Videos } from './videos.entity';

@Entity({ name: 'video_transcripts' })
export class VideoTranscripts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ name: 'start_time' })
  startTime: number;

  @Column()
  duration: number;

  // Join videos
  @Column({ name: 'videos_id' })
  videosId: number;

  @ManyToOne(() => Videos, (videos) => videos.videoTranscripts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'videos_id' })
  videos: Videos;
  // End join videos

  // For migration 
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  // Change to 0, not 1.
  @VersionColumn({ default: 1, nullable: true })
  version: number;
}
