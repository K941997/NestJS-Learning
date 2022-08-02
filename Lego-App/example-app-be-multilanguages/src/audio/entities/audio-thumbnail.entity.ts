import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { File } from '../../file/entities/file.entity';
import { Audio } from './audio.entity';

@Entity('audio_thumbnail')
export class AudioThumbnail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'audio_id' })
  audioId: number;

  @Column({ name: 'file_id' })
  fileId: number;

  @Column({ name: 'thumbnail_id' })
  thumbnailId: number;

  @OneToOne(() => Audio, (audio) => audio.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'audio_id' })
  audio: Audio;

  @OneToOne(() => File, (file) => file.id)
  @JoinColumn({ name: 'file_id' })
  file: File;

  @OneToOne(() => File, (file) => file.id)
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail: File;
}
