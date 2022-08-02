import { Controller, Get, Param, Query } from '@nestjs/common';
import { ThemeClientService } from './../../services/client/theme-client.service';
import { ThemeEntity } from './../../entities/theme.entity';
import { BooleanEnum } from '../../../commons/enums/global.constant';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FindOneThemeClientDto } from '../../../theme/dtos/client/find-one-theme-client-dto';
import { FindAllThemesClientDto } from '../../../theme/dtos/client/find-all-themes-client.dto';

@Controller('client/themes')
export class ThemeClientController {
  constructor(private readonly themeClientService: ThemeClientService) {}

  //!GETALL Themes Client:
  @Get()
  async findAllThemesClient(
    @Query(`page`) page = 1,
    @Query(`limit`) limit = 10,
    @Query() params: FindAllThemesClientDto,
  ): Promise<Pagination<ThemeEntity>> {
    limit = limit > 100 ? 100 : limit;

    params.enabled = BooleanEnum.TRUE; //client enabled = 1

    return this.themeClientService.findAllThemesClient(
      {
        page,
        limit,
        route: `http://localhost:${process.env.PORT}/api/client/themes?`,
      },
      params,
    );
  }

  //!GETONE Theme Client:
  //Get 1 Themes và Pagination Themes's Products
  @Get(`:slug`)
  async findOneThemeClient(
    @Param(`slug`) slug: string,
    @Query() params: FindOneThemeClientDto,
    @Query(`page`) page = 1,
    @Query(`limit`) limit = 10,
  ): Promise<Pagination<ThemeEntity>> {
    limit = limit > 100 ? 100 : limit;

    params.enabled = BooleanEnum.TRUE; //client show theme enabled = 1

    return this.themeClientService.findOneThemeClient(slug, params, {
      page,
      limit,
      route: `http://localhost:${process.env.PORT}/api/client/themes/${slug}?`,
    });
  }
}
