import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { LangEnum } from '../../common/constants/global.constant';
import {
  IsValidText,
  IsValidEnumString,
} from '../../common/decorators/custom-validator.decorator';
export class CreateTopicDto {
  @IsValidText({ minLength: 5, maxLength: 50, required: true })
  key: string;

  @IsValidText({ minLength: 5, maxLength: 255, required: false })
  description: string;

  @IsValidText({ minLength: 5, maxLength: 50, required: true })
  name: string;

  @ApiHideProperty()
  @IsValidEnumString({ enum: LangEnum, required: false })
  lang: LangEnum;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  imageId: number;

}
