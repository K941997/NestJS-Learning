import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Default } from '../../../commons/decorators/default-value.decorator';
import {
  BooleanEnum,
  SortDirectionEnum,
  SortKeyEnum,
} from '../../../commons/enums/global.constant';

export class FindOneThemeClientDto {
  @IsEnum(BooleanEnum)
  @Type(() => Number) //để tìm được boolean=number vd: localhost:/product?enabled=1
  @IsOptional()
  enabled?: BooleanEnum; //enabled for client = 1, for admin = 1 & -1

  @IsEnum(SortKeyEnum)
  @Type(() => String)
  @IsOptional()
  sortKey?: string;

  @IsEnum(SortDirectionEnum)
  @Type(() => String)
  @IsOptional()
  sortDirection?: string;
}
