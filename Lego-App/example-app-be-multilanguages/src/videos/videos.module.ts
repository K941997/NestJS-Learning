import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvDictRepository } from '../dictionary/repository/video-highlight-words.repository';
import { LevelRepository } from '../level/repositories/topic.repository';
import { TopicRepository } from '../topic/repositories/topic.repository';
import { UserToTopicsRepository } from '../user/repository/user-to-topics.repository';
import { UtilsModule } from '../utils-module/utils.module';
import { VideosAdminController } from './controllers/videos-admin.controller';
import { VideosClientController } from './controllers/videos-client.controller';
import { VideoHighlightWordsRepository } from './repositories/video-highlight-words.repository';
import { VideoTranscriptsRepository } from './repositories/video-transcript.repository';
import { VideoTypesRepository } from './repositories/video-types.repository';
import { VideosToTopicRepository } from './repositories/videos-to-topic.repository';
import { VideosRepository } from './repositories/videos.repository';
import { VideosAdminService } from './services/videos-admin.service';
import { VideosClientService } from './services/videos-client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideosRepository,
      VideoTypesRepository,
      VideoTranscriptsRepository,
      VideoHighlightWordsRepository,
      EvDictRepository,
      VideosToTopicRepository,
      TopicRepository,
      LevelRepository,
      UserToTopicsRepository
    ]),
    UtilsModule,
  ],
  controllers: [VideosAdminController, VideosClientController],
  providers: [VideosAdminService, VideosClientService],
})
export class VideosModule {}
