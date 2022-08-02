import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { LangEnum } from '../../common/constants/global.constant';
import {
  IsValidText,
  IsValidEnumString,
} from '../../common/decorators/custom-validator.decorator';


export class UpdateTopicDto {
  // key: string; //Cant update key because Primary Key
  @ApiProperty()
  @IsValidText({ minLength: 5, maxLength: 255, required: false })
  description: string;
  
  @ApiProperty()
  @IsValidText({ minLength: 2, maxLength: 50, required: false })
  name: string;

  @ApiProperty()
  @IsValidEnumString({ enum: LangEnum, required: false })
  lang: LangEnum;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  imageId: number;

}
