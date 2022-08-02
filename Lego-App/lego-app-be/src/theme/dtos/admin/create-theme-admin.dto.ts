import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsEnum,
} from 'class-validator';
import {
  BooleanEnum,
  StatusEnum,
} from '../../../commons/enums/global.constant';
import { IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

// export enum BooleanEnum { //!cho vào file global.constant
//   TRUE = 1, //"Available now" client and admin can see
//   FALSE = -1, //"Disable" only admin can see
// }

export class CreateThemeAdminDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  key: string;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  image: string; //todo: nhập File (Chưa làm)

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  description: string;

  @IsEnum(BooleanEnum)
  @IsOptional()
  enabled: BooleanEnum; //enabled for client = 1, for admin = 1 & -1
}
