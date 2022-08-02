import { Module } from '@nestjs/common';
import { YoutubeTranscriptService } from './services/youtube-transcript.service';
import { AudioToTextService } from './services/audio-to-text.service';
import { UploadService } from './services/upload-file.service';
import { HttpModule } from '@nestjs/axios';
import { UuidService } from './services/uuid.service';
import { TranscribeClient } from '@aws-sdk/client-transcribe';
import { TranslateService } from './services/translate.service';

@Module({
  imports: [HttpModule],
  providers: [
    YoutubeTranscriptService,
    AudioToTextService,
    UploadService,
    UuidService,
    TranscribeClient,
    TranslateService,
  ],
  exports: [
    YoutubeTranscriptService,
    AudioToTextService,
    UploadService,
    UuidService,
    TranslateService,
  ],
})
export class UtilsModule {}
