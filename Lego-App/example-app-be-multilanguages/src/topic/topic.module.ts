import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { TopicByAdminController } from './controllers/topic-by-admin.controller';
import { TopicByClientController } from './controllers/topic-by-client.controller';
// import { SlugProvider } from './slug/slug.provider';
import { TopicTranslation } from './entities/topic-translation.entity';
import { UtilsModule } from '../utils-module/utils.module';
import { TopicRepository } from './repositories/topic.repository';
import { TopicTranslationRepository } from './repositories/topic-translation.repository';
import { UserToTopicsRepository } from '../user/repository/user-to-topics.repository';
import { AudiosToTopicsRepository } from '../audio/repository/audios-to-topics.repository';
import { VideosToTopicRepository } from './../videos/repositories/videos-to-topic.repository';
import { FileRepository } from '../file/file.repository';
import { FileService } from '../file/file.service';

@Module({
  imports: [
UtilsModule,
    TypeOrmModule.forFeature([
      TopicRepository,
      TopicTranslationRepository,
      UserToTopicsRepository,
      AudiosToTopicsRepository,
      VideosToTopicRepository,
      FileRepository,
    ]),
  ],
  controllers: [TopicByAdminController, TopicByClientController],
  providers: [TopicService, FileService],
  exports: [TypeOrmModule],
  // providers: [SlugProvider, TopicService]
})
export class TopicModule {}
