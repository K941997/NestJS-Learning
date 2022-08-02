import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetAllGroupPoliciesDto {
  @Expose()
  @ApiProperty({ example: 'article_management' })
  key: string;

  @Expose()
  @ApiProperty({ example: 'Article Management' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Đây là description' })
  description: string;

  @Expose()
  @ApiProperty({ example: '2022-03-29T01:35:24.114Z' })
  created_at: Date;

  @Expose()
  @ApiProperty({ example: '10' })
  totalMem: number;
}
