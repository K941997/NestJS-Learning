import {
  Injectable,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductAdminDto } from '../../dtos/admin/create-product-admin.dto';
import { UpdateOneProductAdminDto } from '../../dtos/admin/update-product-admin.dto';
import * as slug from 'slug';
import { ProductEntity } from '../../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In, Not } from 'typeorm';
import { FindAllProductsAdminDto } from '../../dtos/admin/find-all-products-admin.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FindOneProductAdminDto } from '../../dtos/admin/find-one-product-admin.dto';
import { ThemeEntity } from '../../../theme/entities/theme.entity';
import { ProductRepository } from '../../repositories/product.repository';
import { ProductToCategoryRepository } from '../../repositories/product-to-category.repository';
import { ThemeRepository } from '../../../theme/repositories/theme.repository';
import { CategoryRepository } from './../../../category/repositories/category.repository';
import { ProductToCategoryEntity } from './../../entities/product-to-category.entity';

@Injectable()
export class ProductAdminService {
  constructor(
    // @InjectRepository(ProductEntity) //!Repository No Custom (Can Use)
    // private productRepository: Repository<ProductEntity>,

    private productRepository: ProductRepository, //!Repository Custom (Can Use)

    private productToCategoryRepository: ProductToCategoryRepository,

    private categoryRepository: CategoryRepository,

    private themeRepository: ThemeRepository,
  ) {}

  slugify(key: string) {
    return slug(key, { lower: true }).toString();
  }

  //!CREATE Product Admin:
  async createProductAdmin(
    createProductAdminDto: CreateProductAdminDto,
  ): Promise<ProductEntity> {
    const {
      key,
      name,
      image,
      price,
      description,
      enabled,
      status,
      themeKey,
      categoryKeys,
    } = createProductAdminDto;

    //existProductKey?
    const existProduct = await this.productRepository.findOneBy({ key: key }); //key is unique
    if (existProduct) {
      throw new ConflictException(`Duplicate Product Key`);
    }

    //existProductName?
    const existName = await this.productRepository.findOneBy({ name: name }); //name is unique
    if (existName) {
      throw new ConflictException('Duplicate Product Name');
    }

    //existThemeKey?
    const existTheme = await this.themeRepository.findOneBy({ key: themeKey });
    if (!existTheme) {
      throw new NotFoundException('Not Found Theme');
    }

    //n-n 1-n:
    const productToCategory = categoryKeys.map((categoryKey) =>
      this.productToCategoryRepository.create({
        categoryKey,
      }),
    );

    const newProduct = this.productRepository.create({
      key,
      name,
      image,
      price,
      description,
      enabled,
      status,
      themeKey,
      productToCategory,
    });
    newProduct.slug = this.slugify(key);

    return this.productRepository.save(newProduct);
  }

  //!GETALL Products Admin:
  async findAllProductsAdmin(
    options: IPaginationOptions, //page, limit
    params: FindAllProductsAdminDto, //slug, enabled, status
  ): Promise<Pagination<ProductEntity>> {
    const { slug, enabled, status, sort } = params;

    const queryBuilder = this.productRepository.createQueryBuilder('products');
    queryBuilder
      .select('products.key')
      .groupBy('products.key')
      .where(() => {
        //Solution Problem: Hiển thị route thì phải show các slug, enabled, status nếu có chứ ko được hiện undefined
        // if (search) { //todo: search cho ra 1 controller riêng localhost/products/search?q=abcxyz (Chưa làm)
        //   queryBuilder.andWhere(
        //     `products.name LIKE :search OR products.description LIKE :search`,
        //     {
        //       search: `%${search}`,
        //     },
        //   );
        //   options.route += `&search=${search}`;
        // }

        if (slug) {
          queryBuilder.andWhere('products.slug LIKE :slug', {
            slug: `%${slug}`,
          });
          options.route += `&slug=${slug}`;
        }
        if (status) {
          queryBuilder.andWhere('products.status LIKE :status', {
            //LIKE with boolean string
            status: `%${status}`,
          });
          options.route += `&status=${status}`;
        }
        if (enabled) {
          queryBuilder.andWhere('products.enabled = :enabled', {
            //= with boolean number
            enabled,
          });
          options.route += `&enabled=${enabled}`;
        }
        if (sort) {
          //sort by price
          queryBuilder.orderBy(`products.price`, sort.toUpperCase());
          options.route += `&enabled=${sort}`;
        } else {
          queryBuilder.orderBy('products.key', 'ASC');
        }
      });

    const result = await paginate<ProductEntity>(queryBuilder, options);

    // Solution Problem: Paginate limit=10 phải đếm theo productKey chứ không phải productsToCategoriesKey
    return new Pagination<ProductEntity>(
      await Promise.all(
        result.items.map(async (productHasKey) => {
          const product = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.theme', 'theme')
            .leftJoinAndSelect(`product.productToCategory`, `productToCategory`)
            .leftJoinAndSelect(`productToCategory.category`, `category`)
            .where('product.key = :key', { key: productHasKey.key })
            .getOne();
          return product;
        }),
      ),
      result.meta,
      result.links,
    );
  }

  //!GETONE Product Admin:
  //Nếu MultiLanguage thì thêm params lang vào DTO GetOne
  async findOneProductAdmin(slug: string) {
    const existProduct = await this.productRepository
      .createQueryBuilder('product')
      .where({ slug })
      .getOne();
    if (!existProduct) {
      throw new NotFoundException('Not Found Product');
    }

    return existProduct;
  }

  //!UPDATEONE Product Admin:
  async updateOneProductAdmin(
    key: string,
    updateProductAdminDto: UpdateOneProductAdminDto,
  ) {
    const {
      name,
      image,
      price,
      description,
      enabled,
      status,
      themeKey,
      categoryKeys,
    } = updateProductAdminDto;

    //existProduct?
    const existProduct = await this.productRepository.findOneBy({ key: key });
    if (!existProduct) {
      throw new NotFoundException('Not Found Product');
    }

    //existProductName of other Product?
    const existProductName = await this.productRepository.findOneBy({
      key: Not(key),
      name: name,
    });
    if (existProductName) {
      throw new ConflictException(`Duplicate Name`);
    }

    //existThemeKey?
    const existTheme = await this.themeRepository.findOneBy({ key: themeKey });
    if (!existTheme) {
      throw new NotFoundException('Not Found Theme');
    }

    //existCategoryKeys?
    const existCategory = await this.categoryRepository.findOneBy({
      key: In(categoryKeys),
    });
    if (!existCategory) {
      throw new NotFoundException(`Not Found 1 Category`);
    } else {
      const productToCategory = new ProductToCategoryEntity();
      productToCategory.productKey = existProduct.key;
      productToCategory.categoryKey = existCategory.key;
      existProduct.productToCategory.push(productToCategory);
    }

    if (updateProductAdminDto) {
      existProduct.name = name;
      existProduct.image = image; //todo: nhập File (Chưa làm)
      existProduct.price = price;
      existProduct.description = description;
      existProduct.enabled = enabled;
      existProduct.status = status;
      existProduct.themeKey = themeKey;
    }

    await this.productRepository.save(existProduct);
    return this.findOneProductAdmin(this.slugify(key)); //Nếu multilanguages thì thêm params lang vào dto getone
  }

  //!DELETEONE Product Admin:
  async deleteOneProductAdmin(key: string) {
    const [result] = await Promise.all([
      this.productRepository.softDelete({ key: key, deletedAt: IsNull() }),

      //Problem: nếu có bản multilanguages thì phải softDelete:
      // this.productTranslate.softDelete({
      //   key
      // })

      //Problem: n-n custom 1-n Muốn xóa Category phải xóa hết các Product và Relation Middle liên quan đến Category:
      this.productToCategoryRepository.softDelete({
        productKey: key,
        deletedAt: IsNull(),
      }),
    ]);

    if (!result.affected) {
      throw new NotFoundException('Not Found Product');
    }
    if (result.affected) {
      return 'Delete Success';
    }

    return result;
  }

  //!DELETEMULTI Products Admin:
  async deleteMultiProductsAdmin(keys: string[]) {
    const [result] = await Promise.all([
      this.productRepository.softDelete({
        key: In(keys),
        deletedAt: IsNull(),
      }),
      //Problem: nếu có bản multilanguages thì phải softDelete:
      // this.productTranslate.softDelete({
      //   key
      // })

      //Problem: n-n custom 1-n Muốn xóa Category phải xóa hết các Product và Relation Middle liên quan đến Category:
      this.productToCategoryRepository.softDelete({
        productKey: In(keys),
        deletedAt: IsNull(),
      }),
    ]);
    if (!result.affected) {
      throw new NotFoundException('Not Found 1 Product');
    }
    if (result.affected) {
      return 'Delete Multi Success';
    }

    return result;
  }
}
