import { LangEnum } from '../../common/constants/global.constant';
import {
  IsValidEnumString,
  IsValidText,
} from '../../common/decorators/custom-validator.decorator';

export class UpdateLevelDto {
  // key: string; //Cant update key because Primary Key

  @IsValidText({ minLength: 5, maxLength: 255, required: false })
  description: string;

  @IsValidText({ minLength: 5, maxLength: 50, required: false })
  name: string;

  @IsValidEnumString({ enum: LangEnum, required: false })
  lang: LangEnum;
}
