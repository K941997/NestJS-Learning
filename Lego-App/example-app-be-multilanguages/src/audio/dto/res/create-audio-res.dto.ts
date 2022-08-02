import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FileRes } from '../../../file/dto/res/file.dto';
import { AudioThumbnailDto } from './audio-thumbnail.dto';
import { AudioRes } from './audio.dto';

@Exclude()
export class CreateAudioResDto {
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

  @ApiProperty()
  @Expose()
  levelKey: string;

  @ApiProperty({ type: AudioThumbnailDto })
  @Type(() => AudioThumbnailDto)
  @Expose()
  audioThumbnail: AudioRes;

  @ApiProperty()
  @Expose()
  audiosToTopics: any;

  @ApiProperty()
  @Expose()
  level: any;

  @ApiProperty()
  @Expose()
  audioHighlightWords: any;

  @ApiProperty()
  @Expose()
  audioTranscripts: any;
}
