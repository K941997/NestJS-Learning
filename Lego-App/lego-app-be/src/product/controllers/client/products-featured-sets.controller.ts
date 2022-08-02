import { Controller, Get, Query } from '@nestjs/common';
import { ProductClientService } from '../../../product/services/client/product-client.service';
import { BooleanEnum } from '../../../commons/enums/global.constant';
import { FindProductsFeaturedSets } from '../../../product/dtos/client/find-products-featured-sets.dto';

@Controller('client/products-featured-sets')
export class ProductsFeaturedSets {
  constructor(private readonly productClientService: ProductClientService) {}
  //!GET RECOMMENTFORYOU Products Client: (Xếp theo lượt yêu thích nhiều nhất, vd: usersToProducts)
  //!GET MOSTPOPULAR Products Client: (Xếp theo số lượng người mua nhiều nhất, vd: usersToProducts)

  //!GET TRENDINGNEWTHEMES Products Client: (Xếp theo ngày mới thêm của themes):
  @Get()
  async findTrendingThemesProductClient(
    @Query() params: FindProductsFeaturedSets,
  ) {
    params.enabled = BooleanEnum.TRUE;
    return this.productClientService.findProductsFeaturedSets(params);
  }
}
