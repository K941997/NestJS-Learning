import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateThemeAdminDto } from '../../dtos/admin/create-theme-admin.dto';
import { ThemeAdminService } from '../../services/admin/theme-admin.service';
import { ThemeEntity } from '../../entities/theme.entity';
import { FindAllThemesAdminDto } from '../../dtos/admin/find-all-themes-admin.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateOneThemeAdminDto } from './../../dtos/admin/update-one-theme-admin.dto';

@Controller('admin/themes')
export class ThemeAdminController {
  constructor(private readonly themeAdminService: ThemeAdminService) {}

  //!CREATE Theme Admin:
  @Post()
  async createThemeAdmin(
    @Body() createThemeAdminDto: CreateThemeAdminDto,
  ): Promise<ThemeEntity> {
    return this.themeAdminService.createThemeAdmin(createThemeAdminDto);
  }

  //!GETALL Themes Admin:
  @Get()
  async findAllThemesAdmin(
    @Query(`page`) page = 1,
    @Query(`limit`) limit = 10,
    @Query() params: FindAllThemesAdminDto,
  ): Promise<Pagination<ThemeEntity>> {
    limit = limit > 100 ? 100 : limit;

    return this.themeAdminService.findAllThemesAdmin(
      {
        page,
        limit,
        route: `http://localhost:${process.env.PORT}/api/admin/themes?`,
      },
      params,
    );
  }

  //!GETONE Theme Admin:
  @Get(`:slug`)
  async findOneThemeAdmin(@Param(`slug`) slug: string) {
    return this.themeAdminService.findOneThemeAdmin(slug);
  }

  //!UPDATEONE Theme Admin:
  @Patch(`:key`)
  async updateOneThemeAdmin(
    @Param(`key`) key: string,
    @Body() updateOneThemeAdminDto: UpdateOneThemeAdminDto,
  ) {
    return this.themeAdminService.updateOneThemeAdmin(
      key,
      updateOneThemeAdminDto,
    );
  }

  //!DELETEONE Theme Admin:
  @Delete(`:key`)
  async deleteOneThemeAdmin(@Param(`key`) key: string) {
    return this.themeAdminService.deleteOneThemeAdmin(key);
  }

  //!DELETEMULTI Themes Admin:
  @Delete()
  async deleteMultiThemesAdmin(@Query(`keys`, ParseArrayPipe) keys: string[]) {
    return this.themeAdminService.deleteMultiThemesAdmin(keys);
  }
}
