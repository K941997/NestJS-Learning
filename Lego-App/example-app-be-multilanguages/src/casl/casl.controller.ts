import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckAbility } from '../common/decorators/checkAbility.decorator';
import { PaginateDto } from '../common/dto/req/paginate.dto';
import { Action, Resource } from '../common/enums/global.enum';
import { ManualSerialize } from '../common/interceptors/serialize.interceptor';
import { CaslService } from './casl.service';
import { CreateGroupPolicyDto } from './dto/req/create-group-policies.dto';
import { DeleteManyGroupPoliciesDto } from './dto/req/delete-many-group-policies.dto';
import { UpdateGroupPoliciesDto } from './dto/req/update-group-policies.dto';
import { DetailsGroupPoliciesDto } from './dto/res/details-group-policies.dto';
import { GetAllGroupPoliciesDto } from './dto/res/get-all-group-policies.dto';
import { PoliciesDto } from './dto/res/policies.dto';

@Controller('casl')
@ApiTags('Authorization')
@CheckAbility({action: Action.MANAGE, subject: Resource.ADMIN})
export class CaslController {
  constructor(private caslService: CaslService) {}

  @Get('policies')
  @ApiResponse({ type: PoliciesDto, description: 'Get all policies in db!' })
  getAllPolicies() {
    return this.caslService.getAllPolicies();
  }

  @Post('group-policy')
  @ApiOperation({ description: 'Create group policies' })
  createGroupPolicies(@Body() body: CreateGroupPolicyDto) {
    return this.caslService.createGroupPolicies(body);
  }

  @Get('group-policy')
  @ApiResponse({
    type: GetAllGroupPoliciesDto,
    description: 'Get all group policies with pagination',
  })
  getAllGroupPolicies(@Query() query: PaginateDto) {
    return this.caslService.getAllGroupPolicies(query);
  }

  @Get('group-policy/:key')
  @ManualSerialize(DetailsGroupPoliciesDto)
  @ApiParam({ name: 'key', example: 'article_management' })
  @ApiResponse({
    type: DetailsGroupPoliciesDto,
    description: 'Return details of specified gorup policies',
  })
  getGroupPoliciesByKey(@Param('key') key: string) {
    return this.caslService.getGroupPoliciesByKey(key);
  }

  @Patch('group-policy')
  @ManualSerialize(DetailsGroupPoliciesDto)
  @ApiResponse({
    type: DetailsGroupPoliciesDto,
    description: 'Return details of specified gorup policies',
  })
  updateGroupPolicies(@Body() body: UpdateGroupPoliciesDto) {
    return this.caslService.updateGroupPolicies(body);
  }

  @Delete('/group-policy')
  @ApiResponse({
    type: Number,
    description: 'Number of group policies has been deleted',
  })
  deleteManyGroupPolicies(@Body() body: DeleteManyGroupPoliciesDto) {
    return this.caslService.deleteManyGroupPolicies(body);
  }

  @Delete('group-policy/:key')
  @ApiParam({ name: 'key', example: 'article_management' })
  deleteGroupPolicies(@Param('key') key: string) {
    return this.caslService.deleteGroupPolicies(key);
  }

  //   For local test
  // @Post('admin-user')
  // createAdminUser(@Body() body: CreateAdminUserDto) {
  //   return this.caslService.createAdminUser(body);
  // }

  //   For local test
  //   Need to be deleted when deploy
  @Get('admin-user/:usernameOrEmail')
  getUserGroupPolicy(@Param('usernameOrEmail') usernameOrEmail: string) {
    return this.caslService.getUserWithPolicies(usernameOrEmail);
  }

  //   For local test
  //   Need to be deleted when deploy
  @Get('test')
  @CheckAbility({ action: Action.MANAGE, subject: Resource.USER })
  test(@Req() req: any) {
    return req.user;
  }
}
