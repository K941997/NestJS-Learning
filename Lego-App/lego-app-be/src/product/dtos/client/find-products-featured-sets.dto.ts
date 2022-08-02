import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDefined,
} from 'class-validator';
import {
  BooleanEnum,
  StatusEnum,
} from '../../../commons/enums/global.constant';

export class FindProductsFeaturedSets {
  // export enum BooleanEnum {
  //   TRUE = 1, //show for client and admin can see
  //   FALSE = -1, //show for only admin can see
  // }

  // export enum StatusEnum {
  //   AVAILABLE = 'available',
  //   DISABLE = 'disable',
  //   SOLD_OUT = 'sold-out',
  //   HARD_TO_FIND = 'hard-to-find',
  // }

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  slug?: string;

  @IsEnum(BooleanEnum)
  @Type(() => Number) //để tìm được boolean=number vd: localhost:/product?enabled=1
  @IsOptional()
  enabled?: BooleanEnum; //enabled for client = 1, for admin = 1 & -1

  @IsEnum(StatusEnum)
  @Type(() => String) //để tìm được boolean=string vd: localhost:/product?status=sold-out
  @IsOptional()
  status?: StatusEnum;
}
