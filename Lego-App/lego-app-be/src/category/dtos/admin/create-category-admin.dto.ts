import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsEnum,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayUnique,
} from 'class-validator';
import { BooleanEnum } from '../../../commons/enums/global.constant';

export class CreateCategoryAdminDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsNotEmpty()
  key: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  image: string; //todo: nhap File

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  description: string;

  @IsEnum(BooleanEnum)
  @IsOptional()
  enabled: BooleanEnum;

  @IsString()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ArrayUnique()
  @IsOptional()
  productKeys: string[];
}
