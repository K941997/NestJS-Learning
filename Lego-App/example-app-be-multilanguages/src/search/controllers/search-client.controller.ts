import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrefixType } from '../../common/constants/global.constant';
import { Authenticate, GetUser } from '../../common/decorators/auth.decorator';
import { User } from '../../user/entities/user.entity';
import { SearchContentsReqDto } from '../dtos/client/req/search-contents.req.dto';
import { SearchClientService } from '../services/search-client.service';

@Controller(`${PrefixType.CLIENT}/search`)
@ApiTags('Client search')
@Authenticate()
export class SearchClientController {
  constructor(private readonly searchClientService: SearchClientService) {}

  @Get('contents')
  searchContents(@Query() query: SearchContentsReqDto, @GetUser() user: User) {
    return this.searchClientService.searchContents(query, user);
  }

  @Get('history')
  getUserSearchHistory(
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
    @GetUser()
    user: User,
  ) {
    return this.searchClientService.getUserSearchHistory(user, size);
  }

  @Delete(':searchId')
  deleteUserSeachHistory(
    @Param('searchId', ParseIntPipe) searchId: number,
    @GetUser() user: User,
  ) {
    return this.searchClientService.deleteSearchHistory(searchId, user);
  }
}
