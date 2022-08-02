import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../common/constants/global.constant';
import { CheckAbility } from '../../common/decorators/checkAbility.decorator';
import { QueryResultDto } from '../../common/dtos/query-result.dto';
import { Action, Resource } from '../../common/enums/global.enum';
import { AddVideoHighlightWordDto } from '../dtos/admin/req/add-video-highlight-word.dto';
import { AddVideoTopicDto } from '../dtos/admin/req/add-video-topic.dto';
import { AddVideoTranscriptDto } from '../dtos/admin/req/add-video-transcript.dto';
import { AddVideoDto } from '../dtos/admin/req/add-video.dto';
import { DeleteVideosDto } from '../dtos/admin/req/delete-videos.dto';
import { GetVideoListDto } from '../dtos/admin/req/get-video-list.dto';
import { RemoveHighlightWordDto } from '../dtos/admin/req/remove-video-highlight-word.dto';
import { RemoveVideoTopicDto } from '../dtos/admin/req/remove-video-topic.dto';
import { RemoveVideoTranscriptDto } from '../dtos/admin/req/remove-video-transcript.dto';
import { TranscriptVideoDto } from '../dtos/admin/req/transcript-video.dto';
import { UpdateVideoTranscriptDto } from '../dtos/admin/req/update-video-transcript.dto';
import { UpdateVideoDto } from '../dtos/admin/req/update-video.dto';
import { TranscriptVideoResDto } from '../dtos/admin/res/transcript-video.res.dto';
import { VideoListResDto } from '../dtos/admin/res/video-list.res.dto';
import { VideosAdminService } from '../services/videos-admin.service';

// Check ability here
@Controller(`${PrefixType.ADMIN}/videos`)
@ApiTags('Videos Admin')
@CheckAbility({ action: Action.MANAGE, subject: Resource.VIDEO })
export class VideosAdminController {
  constructor(private videoAdminService: VideosAdminService) {}

  @Get('transcript')
  getTranscriptVideo(
    @Query() query: TranscriptVideoDto,
  ): Promise<TranscriptVideoResDto[]> {
    return this.videoAdminService.transcriptVideos(query);
  }

  @Get(':videoId')
  getVideoDetails(@Param('videoId', ParseIntPipe) videoId: number) {
    return this.videoAdminService.getVideoDetails(videoId);
  }

  @Get()
  @ApiResponse({ type: VideoListResDto })
  getVideoList(@Query() query: GetVideoListDto) {
    return this.videoAdminService.getVideoList(
      query,
      `${PrefixType.ADMIN}/videos`,
    );
  }

  @Post('transcript')
  @HttpCode(200)
  addTranscript(@Body() body: AddVideoTranscriptDto) {
    return this.videoAdminService.addTranscript(body);
  }

  @Post('highlight-word')
  @HttpCode(200)
  addHighlightWord(@Body() body: AddVideoHighlightWordDto) {
    return this.videoAdminService.addHighlightWord(body);
  }

  @Post('topic')
  @HttpCode(200)
  addTopic(@Body() body: AddVideoTopicDto) {
    return this.videoAdminService.addVideoTopic(body);
  }

  @Post()
  addVideo(@Body() body: AddVideoDto) {
    return this.videoAdminService.addVideo(body);
  }

  @Patch('transcript')
  EditVideoTranscript(
    @Body() body: UpdateVideoTranscriptDto,
  ): Promise<QueryResultDto> {
    return this.videoAdminService.updateTranscript(body);
  }

  @Patch()
  updateVideo(@Body() body: UpdateVideoDto) {
    return this.videoAdminService.updateVideo(body);
  }

  @Delete('transcript')
  removeTranscript(
    @Body() body: RemoveVideoTranscriptDto,
  ): Promise<QueryResultDto> {
    return this.videoAdminService.removeTranscript(body);
  }

  @Delete('highlight-word')
  removeHighlightWord(
    @Body() body: RemoveHighlightWordDto,
  ): Promise<QueryResultDto> {
    return this.videoAdminService.removeHighlightWord(body);
  }

  @Delete('topic')
  removeTopic(@Body() body: RemoveVideoTopicDto): Promise<QueryResultDto> {
    return this.videoAdminService.removeVideoTopic(body);
  }

  @Delete()
  deleteVideos(@Body() body: DeleteVideosDto): Promise<void> {
    return this.videoAdminService.deleteVideos(body);
  }
}
