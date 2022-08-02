import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioRepository } from './repository/audio.repository';
import { AudioTypesRepository } from './repository/audio-types.repository';
import { AudioThumbnailRepository } from './repository/audio-thumbnail.repository';
import { AudioTranscriptRepository } from './repository/audio-transcript.repository';
import { FileRepository } from '../file/file.repository';
import { FileService } from '../file/file.service';
import { UtilsModule } from '../utils-module/utils.module';
import { EvDictRepository } from '../dictionary/repository/video-highlight-words.repository';
import { AudioHighlightWordsRepository } from './repository/audio-highlight-words.repository';
import { AudiosToTopicsRepository } from './repository/audios-to-topics.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AudioRepository,
      AudioTypesRepository,
      AudioThumbnailRepository,
      AudioTranscriptRepository,
      AudioHighlightWordsRepository,
      FileRepository,
      EvDictRepository,
      AudiosToTopicsRepository,
    ]),
    UtilsModule,
  ],
  controllers: [AudioController],
  providers: [AudioService, FileService],
})
export class AudioModule {}
