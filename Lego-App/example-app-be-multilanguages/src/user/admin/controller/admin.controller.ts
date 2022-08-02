import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckAbility } from '../../../common/decorators/checkAbility.decorator';
import { Action, Resource } from '../../../common/enums/global.enum';
import { ManualSerialize } from '../../../common/interceptors/serialize.interceptor';
import { CreateAdminDto } from '../dto/req/create-admin.dto';
import { LoginTestDto } from '../dto/req/login-test.dto';
import { AdminLoginDto } from '../dto/req/login.dto';
import { CreateAdminResDTO } from '../dto/res/create-admin.dto';
import { AdminService } from '../service/admin.service';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // for seeding admin account only
  @Post('/create-admin')
  @ApiOperation({ summary: 'Add admin account for only seeding purpose' })
  @ManualSerialize(CreateAdminResDTO)
  @CheckAbility({ action: Action.MANAGE, subject: Resource.ADMIN })
  create(@Body() body: CreateAdminDto) {
    return this.adminService.create(body);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Admin login' })
  login(@Body() body: AdminLoginDto) {
    return this.adminService.login(body);
  }

  // For testing purpose only
  // @Post('test/login')
  // loginTest(@Body() body: LoginTestDto) {
  //   console.log('go into test/login');
  //   return this.adminService.loginTest(body);
  // }
}
