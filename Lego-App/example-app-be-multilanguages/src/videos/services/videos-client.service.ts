import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  ExpectationFailedExc,
  NotFoundExc,
} from '../../common/exceptions/custom.exception';
import { User } from '../../user/entities/user.entity';
import { UserToTopicsRepository } from '../../user/repository/user-to-topics.repository';
import { FilterVideoDto } from '../dtos/client/req/filter-video.dto';
import { RelevantVideoDto } from '../dtos/client/req/relevant-video.dto';
import { VideosRepository } from '../repositories/videos.repository';

@Injectable()
export class VideosClientService {
  constructor(
    private videosRepo: VideosRepository,
    private userToTopicRepo: UserToTopicsRepository,
  ) {}

  async getVideosDetail(id: number) {
    const video = await this.videosRepo.getVideoDetails(id);
    if (!video) throw new NotFoundExc('Video not found');
    return video;
  }

  async filterAndGetVideo(dataDto: FilterVideoDto) {
    const { levelKey, topicKeys, limit, page } = dataDto;
    const queryBuilder = this.videosRepo
      .createQueryBuilder('videos')
      .leftJoin('videos.videosToTopics', 'videosToTopics')
      .groupBy('videos.id');

    if (levelKey)
      queryBuilder.andWhere('videos.levelKey = :levelKey', { levelKey });
    if (topicKeys && topicKeys.length)
      queryBuilder.andWhere('videosToTopics.topicKey IN (:...topicKeys)', {
        topicKeys,
      });

    const results = await paginate(queryBuilder, { limit, page });
    return results;
  }

  async getRelevantVideos(
    dataDto: RelevantVideoDto,
    user: User,
    route: string,
  ) {
    const { limit, page } = dataDto;

    const userToTopics = await this.userToTopicRepo.find({ userId: user.id });
    if (!userToTopics.length)
      throw new ExpectationFailedExc('User did not choose topic');

    const userTopics = userToTopics.map((item) => item.topicKey);

    const queryBuilder = this.videosRepo
      .createQueryBuilder('videos')
      .leftJoin('videos.videosToTopics', 'videosToTopics')
      .where('videos.levelKey = :userLevel', { userLevel: user.levelKey })
      .andWhere('videosToTopics.topicKey IN (:...userTopics)', { userTopics })
      .groupBy('videos.id');

    return paginate(queryBuilder, { limit, page, route });
  }

  async getFeatureVideos() {
    return this.videosRepo
      .createQueryBuilder('videos')
      .orderBy('(videos.isFeature IS TRUE)', 'DESC')
      .addOrderBy('videos.updatedAt', 'DESC')
      .limit(3)
      .getMany();
  }
}
