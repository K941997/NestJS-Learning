import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BooleanEnum } from '../../../commons/enums/global.constant';

export class UpdateOneThemeAdminDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsOptional()
  image: string; //todo: nhập File (Chưa làm)

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsOptional()
  description: string;

  @IsEnum(BooleanEnum)
  @IsOptional()
  enabled: BooleanEnum;

  //products //!No Use
}
