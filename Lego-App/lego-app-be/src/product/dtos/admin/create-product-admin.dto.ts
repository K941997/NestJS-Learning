import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  ArrayMaxSize,
  ArrayUnique,
} from 'class-validator';
import {
  BooleanEnum,
  StatusEnum,
} from '../../../commons/enums/global.constant';
import { IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { ArrayMinSize } from 'class-validator';

// export enum BooleanEnum { //!cho vào file global.constant
//   TRUE = 1, //"Available now" client and admin can see
//   FALSE = -1, //"Disable" only admin can see
// }

export class CreateProductAdminDto {
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
  image: string; //todo: nhập File (Chưa làm)

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  description: string;

  @IsEnum(BooleanEnum)
  @IsOptional()
  enabled: BooleanEnum; //enabled for client = 1, for admin = 1 & -1

  @IsEnum(StatusEnum)
  @IsOptional()
  status: StatusEnum;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  themeKey: string;

  @IsString()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ArrayUnique()
  @IsOptional()
  categoryKeys: string[];
}
