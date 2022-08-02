import { Injectable, NotFoundException } from '@nestjs/common';
import { ThemeRepository } from './../../repositories/theme.repository';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ThemeEntity } from './../../entities/theme.entity';
import { FindOneThemeClientDto } from './../../dtos/client/find-one-theme-client-dto';
import { FindAllThemesClientDto } from '../../../theme/dtos/client/find-all-themes-client.dto';
import { ProductRepository } from './../../../product/repositories/product.repository';
import { SortKeyEnum } from 'src/commons/constants/global.constant';

@Injectable()
export class ThemeClientService {
  constructor(
    private themeRepository: ThemeRepository,
    private productRepository: ProductRepository,
  ) {}

  //!GETALL Themes Client:
  async findAllThemesClient(
    options: IPaginationOptions,
    params: FindAllThemesClientDto,
  ): Promise<Pagination<ThemeEntity>> {
    const { slug, enabled, sort } = params;
    const opts = {
      //client show enabled = 1
      ...(enabled && { enabled }),
    };

    const queryBuilder = this.themeRepository.createQueryBuilder(`themes`);
    queryBuilder
      .select(`themes.key`)
      .groupBy(`themes.key`)
      .where(() => {
        //Problem: Hiển thị route thì phải show các slug, enabled, status nếu có chứ ko được hiện undefined
        if (slug) {
          queryBuilder.andWhere(`themes.slug LIKE :slug`, {
            slug: `%${slug}`,
          });
          options.route += `&slug=${slug}`;
        }
        if (enabled) {
          //client show enabled = 1
          queryBuilder.andWhere(opts);
        }
        if (sort) {
          //sort by newest -> oldest
          queryBuilder.orderBy(`themes.createdAt`, sort.toUpperCase());
          options.route += `&sort=${sort}`;
        } else {
          queryBuilder.orderBy(`themes.key`, `ASC`);
        }
      });
    const result = await paginate<ThemeEntity>(queryBuilder, options);
    //Problem: Paginate limit=10 phải đếm theo tổng products chứ ko phải productsToCategories:
    return new Pagination<ThemeEntity>(
      await Promise.all(
        result.items.map(async (themeHasKey) => {
          const theme = await this.themeRepository
            .createQueryBuilder(`theme`)
            .where(`theme.key = :key`, { key: themeHasKey.key })
            .getOne();
          return theme;
        }),
      ),
      result.meta,
      result.links,
    );
  }

  //!GETONE Theme Client:
  //Nếu có multi languages thì thêm language vào dto
  //Get 1 Theme show Theme's Products with Pagination and Sort
  async findOneThemeClient(
    slug: string,
    params: FindOneThemeClientDto,
    options: IPaginationOptions,
  ) {
    const { enabled, sortKey, sortDirection } = params;

    const opts = {
      ...(enabled && { enabled }),
    };

    const existTheme = this.themeRepository.createQueryBuilder(`theme`);
    existTheme
      .leftJoinAndSelect(`theme.products`, `products`)
      .where(() => {
        //client show theme's products enabled = 1
        existTheme.andWhere(`products.enabled = 1`);

        //client show theme enabled = 1
        if (enabled) {
          existTheme.andWhere(opts);
        }

        //sort theme's products by sortKey and sortDirection:
        if (sortKey) {
          if (sortKey === 'FEATURED') {
            if (sortDirection === `ASC`) {
              existTheme.orderBy(`products.createdAt`, `ASC`);
              options.route += `&sortDirection=${sortDirection}`;
            }
            if (sortDirection === `DESC`) {
              existTheme.orderBy(`products.createdAt`, `DESC`);
              options.route += `&sortDirection=${sortDirection}`;
            }
            if (!sortDirection) {
              existTheme.orderBy(`products.createdAt`, `DESC`);
            }
          }

          if (sortKey === `PRICE`) {
            if (sortDirection === `ASC`) {
              existTheme.orderBy(`products.price`, `ASC`);
              options.route += `&sortDirection=${sortDirection}`;
            }
            if (sortDirection === `DESC`) {
              existTheme.orderBy(`products.price`, `DESC`);
              options.route += `&sortDirection=${sortDirection}`;
            }
            if (!sortDirection) {
              existTheme.orderBy(`products.price`, `DESC`);
            }
          }

          options.route += `&sortKey=${sortKey}`;
        } else {
          existTheme.orderBy(`products.createdAt`, `DESC`);
        }
      })
      .andWhere({ slug })
      .getOne();

    if (!existTheme) {
      throw new NotFoundException(`Not Found Theme`);
    }

    return await paginate<ThemeEntity>(existTheme, options);
  }
}
