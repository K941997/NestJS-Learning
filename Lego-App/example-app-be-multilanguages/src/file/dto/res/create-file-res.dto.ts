import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FileRes } from './file.dto';
import { PresignedUrlRes } from './presigned-url.dto';

@Exclude()
export class CreateFileRes {
  @ApiProperty({ type: FileRes })
  @Expose()
  @Type(() => FileRes)
  audio: FileRes;

  @ApiProperty({ type: PresignedUrlRes })
  @Expose()
  @Type(() => PresignedUrlRes)
  presign: PresignedUrlRes;
}
