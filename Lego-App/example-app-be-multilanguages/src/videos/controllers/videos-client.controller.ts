import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PrefixType } from '../../common/constants/global.constant';
import { Authenticate, GetUser } from '../../common/decorators/auth.decorator';
import { User } from '../../user/entities/user.entity';
import { FilterVideoDto } from '../dtos/client/req/filter-video.dto';
import { RelevantVideoDto } from '../dtos/client/req/relevant-video.dto';
import { VideosClientService } from '../services/videos-client.service';

@Controller(`${PrefixType.CLIENT}/videos`)
@ApiTags('Videos Client')
export class VideosClientController {
  constructor(private readonly videosClientService: VideosClientService) {}

  @Get('relevant-user')
  @Authenticate()
  getRelevantVideos(
    @Query() query: RelevantVideoDto,
    @GetUser() user: User,
    @Req() req: Request,
  ) {
    return this.videosClientService.getRelevantVideos(query, user, req.url);
  }

  @Get('feature')
  getFeatureVideos() {
    return this.videosClientService.getFeatureVideos()
  }

  @Get(':id')
  getVideoDetail(@Param('id', ParseIntPipe) id: number) {
    return this.videosClientService.getVideosDetail(id);
  }

  @Get()
  filterAndGetVideo(@Query() query: FilterVideoDto) {
    return this.videosClientService.filterAndGetVideo(query);
  }
}
