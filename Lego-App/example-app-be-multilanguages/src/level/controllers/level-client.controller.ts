import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LevelService } from '../level.service';
import { FindManyLevelsDto } from '../dto/find-level.dto';
import { BooleanEnum, LangEnum } from '../../common/constants/global.constant';
import { ApiTags } from '@nestjs/swagger';
import { FindManyLevelsDtoClient } from '../dto/find-level-client.dto';

@Controller('client/levels')
@ApiTags('Level client')
export class LevelClientController {
  constructor(private readonly levelService: LevelService) {}

  //Client GETALL Levels + No Pagination || Pagination (MultiLanguage):
  @Get()
  async findAllByClient(
    @Query() params: FindManyLevelsDtoClient,
    @Query('page') page: number,
    @Query('limit') limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    if (!params.lang) {
      params.lang = LangEnum.En;
    }

    //NoPagination:
    if (!page) return this.levelService.findAllByClientNoPagination(params);

    //Pagination:
    return this.levelService.findAllByClientPagination(
      {
        page: Number(page),
        limit: Number(limit),
        route: `http://localhost:${process.env.PORT}/client/levels?lang=${params.lang}`,
      },
      params,
    );
  }
}
