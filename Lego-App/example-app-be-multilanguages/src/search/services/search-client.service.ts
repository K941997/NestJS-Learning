import { Injectable } from '@nestjs/common';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import SqlString from 'sqlstring';
import { getManager } from 'typeorm';
import { AudioRepository } from '../../audio/repository/audio.repository';
import { MediaType } from '../../common/enums/global.enum';
import { User } from '../../user/entities/user.entity';
import { VideosRepository } from '../../videos/repositories/videos.repository';
import { UserSearchsRepository } from '../repositories/user-highlight-words.repository';
import { SearchContentsReqDto } from '../dtos/client/req/search-contents.req.dto';
import { SearchContentsResDto } from '../dtos/client/res/search-contents.res.dto';

@Injectable()
export class SearchClientService {
  constructor(
    private userSearchRepo: UserSearchsRepository,
    private videosRepo: VideosRepository,
    private audioRepo: AudioRepository,
  ) {}

  /**
   * Union with TypeORM issue: https://github.com/typeorm/typeorm/issues/2992#issuecomment-876965843
   */
  async searchContents(dataDto: SearchContentsReqDto, user: User) {
    const { keyword, limit, page } = dataDto;
    const escapedKeyword = SqlString.escape(`%${keyword}%`);

    const videoQuery = this.videosRepo
      .createQueryBuilder('videos')
      .where((qb) => {
        qb.where(`videos.name ILIKE ${escapedKeyword}`).orWhere(
          `videos.desc ILIKE ${escapedKeyword}`,
        );
      })
      .select([
        'videos.id AS id',
        'videos.name AS name',
        'videos.desc AS desc',
        `'${MediaType.VIDEO}' AS media_type`,
      ])
      .getQuery();

    const audioQuery = this.audioRepo
      .createQueryBuilder('audios')
      .where((qb) => {
        qb.where(`audios.title ILIKE ${escapedKeyword}`).orWhere(
          `audios.desc ILIKE ${escapedKeyword}`,
        );
      })
      .select([
        'audios.id AS id',
        'audios.title AS name',
        'audios.desc AS desc',
        `'${MediaType.AUDIO}' as media_type`,
      ])
      .getQuery();

    const query = `(${videoQuery}) UNION (${audioQuery}) ORDER BY id LIMIT ${SqlString.escape(
      limit,
    )} OFFSET ${SqlString.escape((page - 1) * limit)}`;

    const [rawData, totalRaw] = await Promise.all([
      getManager().query(query),
      getManager().query(
        `SELECT COUNT(*) as "totalItems" FROM (${query}) as alias`,
      ),
    ]);
    const { totalItems } = totalRaw[0];

    // add to search history
    this.addUserSearch(keyword, user);

    return new Pagination<SearchContentsResDto, IPaginationMeta>(rawData, {
      itemCount: rawData.length,
      totalItems: totalItems,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  }

  async getUserSearchHistory(user: User, limit: number) {
    return this.userSearchRepo.find({
      where: { userId: user.id },
      take: limit,
    });
  }

  async deleteSearchHistory(searchId: number, user: User) {
    const result = await this.userSearchRepo.softDelete({
      id: searchId,
      userId: user.id,
    });
    return { deleted: result.affected };
  }

  async addUserSearch(keyword: string, user: User) {
    return this.userSearchRepo.upsert(
      { keyword, searchTime: new Date(), userId: user.id },
      { conflictPaths: ['keyword'], skipUpdateIfNoValuesChanged: true },
    );
  }
}
