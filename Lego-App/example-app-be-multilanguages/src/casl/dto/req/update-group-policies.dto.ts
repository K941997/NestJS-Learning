import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateGroupPoliciesDto {
  @IsString()
  @ApiProperty({ example: 'article_management' })
  key: string;

  @IsString()
  @ApiProperty({ example: 'Article Management' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'Đây là description' })
  description: string;

  @IsArray()
  @ApiProperty({
    type: [String],
    example: [
      'e2ffe6bc-dc60-434e-ad9e-c3709899353d',
      'a37c31ff-19ff-4580-9f24-e3c44e5e7f7b',
    ],
  })
  policiesIds: number[];
}
