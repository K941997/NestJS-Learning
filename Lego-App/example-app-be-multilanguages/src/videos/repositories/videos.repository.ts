import { EntityRepository, Repository } from 'typeorm';
import { Videos } from '../entities/videos.entity';

@EntityRepository(Videos)
export class VideosRepository extends Repository<Videos> {
  async getVideoDetails(id: number) {
    return this.createQueryBuilder('videos')
      .leftJoinAndSelect('videos.videosType', 'videosType')
      .leftJoinAndSelect('videos.videoTranscripts', 'videoTranscripts')
      .leftJoinAndSelect('videos.videoHighlightWords', 'videoHighlightWords')
      .leftJoinAndSelect('videoHighlightWords.evDict', 'evDict')
      .leftJoinAndSelect('videos.level', 'level')
      .leftJoinAndSelect('level.translates', 'levelTranslations')
      .leftJoinAndSelect('videos.videosToTopics', 'videosToTopics')
      .leftJoinAndSelect('videosToTopics.topic', 'topic')
      .leftJoinAndSelect('topic.translates', 'topicTranslations')
      .where('videos.id = :id', { id })
      .getOne();
  }
}
