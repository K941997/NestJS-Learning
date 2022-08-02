import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteManyGroupPoliciesDto {
  @ApiProperty({
    type: [String],
    example: ['admin_article', 'article_management'],
  })
  @IsString({ each: true })
  groupPoliciesKeys: string[];
}
