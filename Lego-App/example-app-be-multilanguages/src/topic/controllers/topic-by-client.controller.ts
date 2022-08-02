import {
  Controller,
  Get, Query
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LangEnum } from '../../common/constants/global.constant';
import { FindManyTopicDtoClient } from '../dto/find-topic-client.dto';
import { TopicService } from '../topic.service';

@Controller('client/topics')
@ApiTags('Topic Client')
export class TopicByClientController {
  constructor(private readonly topicService: TopicService) {}

  //Client GETALL Topics + No Pagination || Pagination (MultiLanguage):
  @Get()
  async findAllByClient(
    @Query() params: FindManyTopicDtoClient, //language, no enabled, no slug
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    if (!params.lang) {
      params.lang = LangEnum.En;
    }

    //NoPagination:
    if (!page) return this.topicService.findAllByClientNoPagination(params);

    //Pagination:
    return this.topicService.findAllByClientPagination(
      {
        page: Number(page),
        limit: Number(limit),
        route: `http://localhost:${process.env.PORT}/client/topics?lang=${params.lang}`,
      },
      params,
    );
  }

  //Client Get 4 Topics most selected:
  @Get('/feature')
  async findFeatureTopics(
    @Query() params: FindManyTopicDtoClient
  ) {
    if (!params || !params.lang) {
      params.lang = LangEnum.En;
    }

    return this.topicService.findFeatureTopics(params);
  }
} 
