import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LevelTranslation } from './level-translation.entity';
import { BaseEntity } from '../../common/entities/base.entity'; //version, createAt, updateAt, deleteAt
import { Videos } from '../../videos/entities/videos.entity';
import { User } from '../../user/entities/user.entity';
import { Audio } from '../../audio/entities/audio.entity';

@Entity()
export class Level extends BaseEntity {
  // @PrimaryGeneratedColumn()
  // id: number;

  @PrimaryColumn()
  key: string;

  @Column({
    nullable: true,
  })
  slug: string;

  @Column({
    nullable: true,
  })
  description: string;

  @OneToMany(
    () => LevelTranslation,
    (levelTranslate: LevelTranslation) => levelTranslate.level,
    {
      cascade: ['insert'],
    },
  )
  translates: LevelTranslation[];

  // Join videos
  @OneToOne(() => Videos, (video) => video.level, { cascade: ['insert'] })
  video: Videos;
  // End join videos

  // Join user
  @OneToMany(() => User, (user) => user.level, { cascade: ['insert'] })
  user: User[];
  // End join user

  // Join audios
  @OneToOne(() => Audio, (audio) => audio.level, { cascade: ['insert'] })
  audio: Audio;
  // End join audios
}
