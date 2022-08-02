import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginateDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiProperty({ example: 1, required: false })
  page: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  @ApiProperty({ example: 20, required: false })
  limit: number;
}
