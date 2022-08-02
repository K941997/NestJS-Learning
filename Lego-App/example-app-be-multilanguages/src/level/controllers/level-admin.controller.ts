import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  ParseArrayPipe,
} from '@nestjs/common';
import { LevelService } from '../level.service';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { Level } from '../entities/level.entity';
import { FindManyLevelsDto, FindOneLevelDto } from '../dto/find-level.dto';
import { LangEnum } from '../../common/constants/global.constant';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { CheckAbility } from '../../common/decorators/checkAbility.decorator';
import { Action, Resource } from '../../common/enums/global.enum';

@Controller('admin/levels')
@ApiTags('Level Admin')
@CheckAbility({action: Action.MANAGE, subject: Resource.LEVEL})
export class LevelAdminController {
  constructor(private readonly levelService: LevelService) {}

  //Admin CREATE Level (MultiLanguage):
  @Post()
  // @UsePipes(ValidationPipe)
  async create(@Body() createLevelDto: CreateLevelDto): Promise<Level> {
    return this.levelService.create(createLevelDto);
  }

  //Admin GETALL Levels + Search(slug) + Pagination (MultiLanguage):
  @Get()
  // @UsePipes(ValidationPipe)
  async findAllByAdmin(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() params: FindManyLevelsDto, //language, enabled, slug, pageMin=1, limitMin=1
  ): Promise<Pagination<Level>> {
    limit = limit > 100 ? 100 : limit;
    if (!params.lang) {
      params.lang = LangEnum.En;
    }

    return this.levelService.findAllByAdmin({ page, limit }, params);
  }

  //Admin GETONE Level (MultiLanguage):
  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Query() params: FindOneLevelDto) {
    if (!params.lang) {
      params.lang = LangEnum.En;
    }
    return this.levelService.findOne(slug, params);
  }

  //Admin UPDATEONE Level (MultiLanguage):
  @Put(':key')
  async update(
    @Param('key') key: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    return this.levelService.update(key, updateLevelDto);
  }

  //Admin REMOVEONE Level (MultiLanguage):
  @Delete(':key')
  async remove(@Param('key') key: string) {
    return this.levelService.remove(key);
  }

  //Admin REMOVEMULTI Levels (MultiLanguage):
  @Delete()
  async removeMulti(@Query('keys', ParseArrayPipe) keys: string[]) {
    return this.levelService.removeMulti(keys);
  }
}
