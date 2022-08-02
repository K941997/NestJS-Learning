import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsNumber,
  IsEnum,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
} from 'class-validator';
import { BooleanEnum, StatusEnum } from 'src/commons/constants/global.constant';
import { CreateProductAdminDto } from './create-product-admin.dto';

export class UpdateOneProductAdminDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsNotEmpty()
  @IsOptional()
  image: string; //todo: nhập File (Chưa làm)

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  price: number;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsEnum(BooleanEnum)
  @IsNotEmpty()
  @IsOptional()
  enabled: BooleanEnum;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  @IsOptional()
  status: StatusEnum;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @IsOptional()
  themeKey: string;

  @IsString()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ArrayUnique()
  @IsOptional()
  @IsNotEmpty()
  categoryKeys: string[];
}
