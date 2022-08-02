import {
  IsValidEnum,
  IsValidNumber,
  IsValidText,
  JustOneOfBaseOnEnum,
} from '../../../common/decorators/custom-validator.decorator';
import { MediaType } from '../../../common/enums/global.enum';

export class AddHighlightWordReqDto {
  @IsValidEnum({ enum: MediaType, required: true })
  @JustOneOfBaseOnEnum([
    { enumValue: MediaType.AUDIO, field: 'audioId' },
    { enumValue: MediaType.VIDEO, field: 'videoId' },
  ])
  mediaType: MediaType;

  @IsValidNumber({ required: false, min: 1 })
  videoId?: number;

  @IsValidNumber({ required: false, min: 1 })
  audioId?: number;

  @IsValidText({required: true, maxLength: 50})
  word: string
}
