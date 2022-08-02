import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FileRes } from './file.dto';
import { PresignedFieldRes } from './presigned-field.dto';

@Exclude()
export class PresignedUrlRes {
  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty({ type: PresignedFieldRes })
  @Expose()
  @Type(() => PresignedFieldRes)
  fields: PresignedFieldRes;
}
