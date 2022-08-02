import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';
import { BooleanEnum, LangEnum } from '../../common/constants/global.constant';
import { Default } from '../../common/decorators/default-value.decorator';
import {
  IsValidEnumNumber,
  IsValidEnumString,
  IsValidText,
} from '../../common/decorators/custom-validator.decorator';

export class CreateLevelDto {
  @IsValidText({ minLength: 5, maxLength: 50, required: true })
  key: string;

  @IsValidText({ minLength: 5, maxLength: 255, required: false })
  description: string;

  @IsValidText({ minLength: 5, maxLength: 50, required: true })
  name: string;

  @ApiHideProperty()
  @IsValidEnumString({ enum: LangEnum, required: false })
  lang: LangEnum;
}
