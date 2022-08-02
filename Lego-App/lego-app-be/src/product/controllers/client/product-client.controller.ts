import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';

import { ProductEntity } from '../../entities/product.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ProductClientService } from '../../services/client/product-client.service';
import { FindAllProductsClientDto } from '../../dtos/client/find-all-products-client.dto';
import { BooleanEnum } from 'src/commons/constants/global.constant';
import { FindOneProductClientDto } from '../../dtos/client/find-one-product-client-dto';

@Controller('client/products')
export class ProductClientController {
  constructor(private readonly productClientService: ProductClientService) {}

  //!GETALL Products Client:
  @Get()
  async findAllProductsClient(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() params: FindAllProductsClientDto,
  ): Promise<Pagination<ProductEntity>> {
    limit = limit > 100 ? 100 : limit;

    params.enabled = BooleanEnum.TRUE; //enabled for client = 1, for admin = 1 & -1

    return this.productClientService.findAllProductsClient(
      {
        page,
        limit,
        route: `http://localhost:${process.env.PORT}/api/client/products?`,
      }, //admin có thể không cần route, route cho SEO bên client
      params,
    );
  }

  //!GETONE Product Client:
  @Get(':slug')
  async findOneProductAdmin(
    @Param('slug') slug: string,
    @Query() params: FindOneProductClientDto,
  ) {
    params.enabled = BooleanEnum.TRUE; //enabled for client = 1, for admin = 1 & -1

    return this.productClientService.findOneProductClient(slug, params);
  }
}
