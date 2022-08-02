import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './../../entities/product.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FindAllProductsClientDto } from './../../dtos/client/find-all-products-client.dto';
import { FindOneProductClientDto } from '../../dtos/client/find-one-product-client-dto';
import { ProductRepository } from './../../repositories/product.repository';
import { FindProductsFeaturedSets } from '../../../product/dtos/client/find-products-featured-sets.dto';

@Injectable()
export class ProductClientService {
  constructor(
    // @InjectRepository(ProductEntity) //!Repository No Custom (Can Use)
    // private productRepository: Repository<ProductEntity>,

    private productRepository: ProductRepository,
  ) {}

  //!GETALL Products Client:
  async findAllProductsClient(
    options: IPaginationOptions,
    params: FindAllProductsClientDto,
  ): Promise<Pagination<ProductEntity>> {
    const { slug, status, enabled, sort } = params;
    const opts = {
      //show client enabled = 1
      ...(enabled && { enabled }),
    };

    const queryBuilder = this.productRepository.createQueryBuilder('products');
    queryBuilder
      .select('products.key')
      .groupBy('products.key')
      .where(() => {
        //Problem: Hiển thị route thì phải show các slug, enabled, status nếu có chứ ko được hiện undefined
        if (slug) {
          queryBuilder.andWhere('products.slug LIKE :slug', {
            slug: `%${slug}`,
          });
          options.route += `&slug=${slug}`;
        }
        if (status) {
          queryBuilder.andWhere('products.status LIKE :status', {
            status: `%${status}`,
          });
          options.route += `&status=${status}`;
        }
        if (enabled) {
          //show client enabled = 1
          queryBuilder.andWhere(opts);
        }
        if (sort) {
          //sort by price
          queryBuilder.orderBy(`products.price`, sort.toUpperCase());
          options.route += `&sort=${sort}`;
        } else {
          queryBuilder.orderBy('products.key', 'ASC');
        }
      });

    const result = await paginate<ProductEntity>(queryBuilder, options);

    //Problem: Paginate limit=10 đếm theo tổng productToCategory chứ ko phải tổng product:
    return new Pagination<ProductEntity>(
      await Promise.all(
        result.items.map(async (productHasKey) => {
          const product = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.theme', 'theme')
            .where('product.key = :key', { key: productHasKey.key })
            .getOne();

          return product;
        }),
      ),
      result.meta,
      result.links,
    );
  }

  //!GETONE Product Client:
  //Nếu MultiLanguage thì thêm params lang vào GetOneDto
  async findOneProductClient(slug: string, params: FindOneProductClientDto) {
    const { enabled } = params;
    const opts = {
      //show client enabled = 1
      ...(enabled && { enabled }),
    };
    const existProduct = await this.productRepository
      .createQueryBuilder('product')
      .where({ slug })
      .andWhere(opts) //show client enabled = 1
      .leftJoinAndSelect('product.theme', 'theme')
      .getOne();

    if (!existProduct) {
      throw new NotFoundException('Not Found Product');
    }

    return existProduct;
  }

  //!GETALL FEATURED SETS Products Client: (Lấy 13 cái Products createdAt mới nhất)
  async findProductsFeaturedSets(params: FindProductsFeaturedSets) {
    const { enabled } = params;
    const opts = {
      ...(enabled && { enabled }),
    };
    const queryBuilder = await this.productRepository
      .createQueryBuilder(`products`)
      .where(opts)
      .select(
        `products.image, products.name, products.price, products.created_at`,
      )
      .groupBy(
        `products.image, products.name, products.price, products.created_at`,
      )
      .limit(13)
      // .andWhere(`products.themeKey is not null `) //không cho hiện "products.themeKey": null
      .orderBy(`products.createdAt`, `ASC`) //sắp xếp theo Products mới nhất đến cũ nhất
      .getRawMany();

    return queryBuilder;
  }
}
