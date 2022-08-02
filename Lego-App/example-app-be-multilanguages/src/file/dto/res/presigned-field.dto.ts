import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FileRes } from './file.dto';

@Exclude()
export class PresignedFieldRes {
  @ApiProperty()
  @Expose()
  acl: string;

  @ApiProperty()
  @Expose()
  bucket: string;

  @ApiProperty()
  @Expose()
  'X-Amz-Algorithm': number;

  @ApiProperty()
  @Expose()
  'X-Amz-Credential': string;

  @ApiProperty()
  @Expose()
  'X-Amz-Date': string;

  @ApiProperty()
  @Expose()
  key: string;

  @ApiProperty()
  @Expose()
  Policy: string;

  @ApiProperty()
  @Expose()
  'X-Amz-Signature': string;
}
