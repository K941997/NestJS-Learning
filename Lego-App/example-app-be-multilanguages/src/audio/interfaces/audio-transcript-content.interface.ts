export interface IAudioTranscriptWord {
  start_time: string;
  content: string;
  type: string;
}

export interface IAudioTranscriptContent {
  content: IAudioTranscriptWord[];
}
