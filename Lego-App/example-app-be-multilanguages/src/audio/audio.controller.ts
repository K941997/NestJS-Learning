import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Authenticate, GetUser } from '../common/decorators/auth.decorator';
import { CheckAbility } from '../common/decorators/checkAbility.decorator';
import { Action, Resource } from '../common/enums/global.enum';
import { ManualSerialize } from '../common/interceptors/serialize.interceptor';
import { User } from '../user/entities/user.entity';
import { AudioService } from './audio.service';
import { AddHighlightWordDto } from './dto/req/add-highlight-word.dto';
import { CreateAudioDto } from './dto/req/create-audio.dto';
import { DeleteAudiosReqDto } from './dto/req/delete-audio.dto';
import { DeleteHighlightWordDto } from './dto/req/delete-highlight-word.dto';
import { GetAudioListReqDto } from './dto/req/get-audio-list.req.dto';
import { RemoveAudioTopicDto } from './dto/req/remove-audio-topic.dto';
import { UpdateAudioTranscriptDto } from './dto/req/update-audio-transcript.dto';
import { UpdateAudioDto } from './dto/req/update-audio.dto';
import { AudioListResDto } from './dto/res/audio-list.res.dto';
import { CreateAudioResDto } from './dto/res/create-audio-res.dto';

@Controller('audio')
@ApiTags('Audios')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Get()
  @ApiOperation({ summary: 'Get list podcast' })
  @ApiOkResponse({ type: AudioListResDto })
  @ManualSerialize(AudioListResDto)
  getPodcastList(@Query() query: GetAudioListReqDto): Promise<AudioListResDto> {
    return this.audioService.getAudioList(query, `audio`);
  }

  @Post()
  @ApiOperation({ summary: 'Save new podcast' })
  @ApiOkResponse({ type: CreateAudioResDto })
  @ManualSerialize(CreateAudioResDto)
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  async create(@Body() createAudioDto: CreateAudioDto) {
    return this.audioService.create(createAudioDto);
  }

  @Get('/transcribing-status')
  @ApiOperation({ summary: 'Get all transcribing job status based on name' })
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  async getListTranscribeJobByName(@Query('name') name: string) {
    return this.audioService.getListAudioTranscriptStatus(name);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: { audioId: { type: 'number' } },
    },
  })
  @Post('/convert-to-text')
  @ApiOperation({ summary: 'Convert podcast to text' })
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  @Authenticate()
  async convertAudioToText(
    @GetUser() user: User,
    @Body('audioId') audioId: number,
  ) {
    return this.audioService.convertAudioToText(user, audioId);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: { audioId: { type: 'number' } },
    },
  })
  @Post('/transript')
  @ApiOperation({ summary: 'Save podcast transcript of transcribed audio' })
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  async createAudioTranscript(@Body('audioId') audioId: number) {
    return this.audioService.saveAudioTranscript(audioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get podcast details' })
  @ApiOkResponse({ type: CreateAudioResDto })
  @ManualSerialize(CreateAudioResDto)
  async getOne(@Param('id') id: number) {
    return this.audioService.getOneWithThumbnail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update podcast' })
  @ApiOkResponse({ type: AudioListResDto })
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  async updateAudio(@Param('id') id: number, @Body() body: UpdateAudioDto) {
    return this.audioService.update(id, body);
  }

  @Post('/transcript/highlight-words')
  @ApiOperation({ summary: 'Highlight words in podcast transcript' })
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  async highlightWords(@Body() body: AddHighlightWordDto) {
    return this.audioService.highlightWords(body);
  }

  @Delete('/transcript/highlight-words')
  @ApiOperation({ summary: 'Delete single highlight word in podcast' })
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  async removeHighlightWords(@Body() body: DeleteHighlightWordDto) {
    return this.audioService.removeHighlightWord(body);
  }

  @Patch('/transcript/:id')
  @ApiOperation({ summary: 'Update podcast transcript' })
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  async updateAudioTranscript(
    @Param('id') id: number,
    @Body() body: UpdateAudioTranscriptDto,
  ) {
    return this.audioService.updateAudioTranscript(id, body);
  }

  @Delete('topic')
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  removeTopic(@Body() body: RemoveAudioTopicDto) {
    return this.audioService.removeAudioTopic(body);
  }

  @Delete()
  @CheckAbility({ action: Action.MANAGE, subject: Resource.AUDIO })
  @ApiOperation({ summary: 'Delete podcast' })
  async deleteAudios(@Body() body: DeleteAudiosReqDto) {
    return this.audioService.deleteAudios(body);
  }
}
