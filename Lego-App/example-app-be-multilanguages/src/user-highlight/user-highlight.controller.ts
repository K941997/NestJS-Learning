import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Authenticate, GetUser } from '../common/decorators/auth.decorator';
import { User } from '../user/entities/user.entity';
import { AddHighlightWordReqDto } from './dtos/req/add-highlight-word.req.dto';
import { DeleteHighlightWordReqDto } from './dtos/req/delete-highlight-words.req.dto';
import { UserHighlightService } from './user-highlight.service';

@Controller('user-highlight')
@ApiTags('Highlight')
@Authenticate()
export class UserHighlightController {
  constructor(private readonly highlightService: UserHighlightService) {}

  @Post('word')
  async addUserHighlightWord(
    @Body() body: AddHighlightWordReqDto,
    @GetUser() user: User,
  ) {
    return this.highlightService.addUserHighlightWord(body, user);
  }

  @Get('word')
  async getUserHighlightWord(@GetUser() user: User) {
    return this.highlightService.getUserHighlightWord(user);
  }

  @Delete('word')
  async deleteUserHighlightWords(
    @Body() body: DeleteHighlightWordReqDto,
    @GetUser() user: User,
  ) {
    return this.highlightService.deleteUserHighlightWords(body, user);
  }
}
