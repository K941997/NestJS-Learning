import { IsBoolean, IsOptional } from 'class-validator';
import {
  IsValidArrayString,
  IsValidNumber,
  IsValidText,
} from '../../../../common/decorators/custom-validator.decorator';

export class UpdateVideoDto {
  @IsValidNumber({ required: true, min: 0 })
  videoId: number;

  @IsValidText({ required: false })
  levelKey?: string;

  @IsValidText({ required: false, maxLength: 50 })
  name?: string;

  @IsValidText({ required: false, maxLength: 255 })
  desc?: string;

  @IsBoolean()
  @IsOptional()
  isFeature?: boolean;
}
