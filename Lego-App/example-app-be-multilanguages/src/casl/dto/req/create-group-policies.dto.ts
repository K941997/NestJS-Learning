import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class CreateGroupPolicyDto {
  @IsString()
  @ApiProperty({ example: 'Admin article' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @ApiProperty({ example: 'Nhóm quyền để quản lý các bài đăng' })
  @Transform(({ value }) => value?.trim())
  description: string;

  @IsArray()
  @ApiProperty({
    type: [String],
    example: [1, 2],
  })
  policiesIds: number[];
}
