import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FileRes {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  key: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  uploaderId: number;

  @ApiProperty()
  @Expose()
  url: string;
}
