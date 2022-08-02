import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Default } from '../../../commons/decorators/default-value.decorator';
import { BooleanEnum } from 'src/commons/constants/global.constant';

export class FindOneProductClientDto {
  @IsEnum(BooleanEnum)
  @Type(() => Number) //để tìm được boolean=number vd: localhost:/product?enabled=1
  @IsOptional()
  enabled?: BooleanEnum; //enabled for client = 1, for admin = 1 & -1
}
