import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AudioThumbnail } from '../../audio/entities/audio-thumbnail.entity';
import {
  BooleanEnum,
  SupportFileType,
} from '../../common/constants/global.constant';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity('files')
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  key: string;

  @Column()
  bucket: string;

  @Column({ enum: SupportFileType, default: SupportFileType.mp3 })
  type: SupportFileType;

  @Column({ default: 0 })
  size: number;

  @Column({ enum: BooleanEnum, default: BooleanEnum.FALSE })
  verified: BooleanEnum;

  @Column({ name: 'uploader_id' })
  uploaderId: number;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;

  @OneToOne(() => AudioThumbnail, (audioThumbnail) => audioThumbnail.file)
  audioThumbnail: AudioThumbnail;

  url: string;
}
