import { TranscriptResponse } from '../../utils-module/services/youtube-transcript.service';
import {
  IsValidNumber,
  IsValidText,
} from '../decorators/custom-validator.decorator';

export class TranscriptResultDto implements TranscriptResponse {
  @IsValidNumber({ required: true, min: 0 })
  duration: number;

  @IsValidNumber({ required: true, min: 0 })
  offset: number;

  @IsValidText({ required: true })
  text: string;
}
