import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FileRes } from '../../../file/dto/res/file.dto';
import { Audio } from '../../entities/audio.entity';

@Exclude()
export class AudioThumbnailDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  audio: Audio;

  @ApiProperty({
    type: FileRes,
  })
  @Expose()
  @Type(() => FileRes)
  file: FileRes;

  @ApiProperty({
    type: FileRes,
  })
  @Expose()
  @Type(() => FileRes)
  thumbnail: FileRes;
}
