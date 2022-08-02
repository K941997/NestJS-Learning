import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AudiosToTopics } from '../../entities/audios-to-topics.entity';

@Exclude()
export class AudioRes {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  audioCode: string;

  @ApiProperty()
  @Expose()
  audioTypeKey: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  desc: string;
}

export class SavedAudio {
  id: number;
  audioCode: string;
  audioTypeKey: string;
  title: string;
  desc: string;
  audiosToTopics: AudiosToTopics[];
  levelKey: string;
}
