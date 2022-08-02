import { TranscriptResponse } from '../../../../utils-module/services/youtube-transcript.service';

export class TranscriptVideoResDto implements TranscriptResponse {
  duration: number;
  offset: number;
  text: string;
}
