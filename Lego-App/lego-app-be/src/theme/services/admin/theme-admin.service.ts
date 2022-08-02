import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Not, IsNull, In } from 'typeorm';
import { ThemeEntity } from '../../entities/theme.entity';
import * as slug from 'slug';
import { CreateThemeAdminDto } from '../../dtos/admin/create-theme-admin.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FindAllThemesAdminDto } from '../../dtos/admin/find-all-themes-admin.dto';
import { ThemeRepository } from '../../repositories/theme.repository';
import { UpdateOneThemeAdminDto } from './../../dtos/admin/update-one-theme-admin.dto';
import { ProductRepository } from './../../../product/repositories/product.repository';

@Injectable()
export class ThemeAdminService {
  constructor(
    // @InjectRepository(ThemeEntity) //!Repository No Custom (Can Use)
    // private themeRepository: Repository<ThemeEntity>,

    private themeRepository: ThemeRepository, //!Repository Custom (Can Use)

    private productRepository: ProductRepository,
  ) {}

  slugify(key: string) {
    return slug(key, { lower: true }).toString();
  }

  //!CREATE Theme Admin:
  async createThemeAdmin(
    createThemeAdminDto: CreateThemeAdminDto,
  ): Promise<ThemeEntity> {
    const { key, name, image, description, enabled } = createThemeAdminDto;

    //existThemeKey?
    const existTheme = await this.themeRepository.findOneBy({ key: key }); //key is unique
    if (existTheme) {
      throw new ConflictException('Duplicate Theme Key');
    }

    //existThemeName?
    const existName = await this.themeRepository.findOneBy({ name: name }); //name is unique
    if (existName) {
      throw new ConflictException('Duplicate Theme Name');
    }

    const newTheme = this.themeRepository.create(createThemeAdminDto);
    newTheme.slug = this.slugify(key);

    return this.themeRepository.save(newTheme);
  }

  //!GETALL Themes Admin:
  async findAllThemesAdmin(
    options: IPaginationOptions, //page, limit
    params: FindAllThemesAdminDto,
  ): Promise<Pagination<ThemeEntity>> {
    const { slug, enabled, sort } = params;

    const queryBuilder = this.themeRepository.createQueryBuilder('themes');
    queryBuilder
      .select('themes.key')
      .groupBy('themes.key')
      .where(() => {
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
          queryBuilder.andWhere('themes.slug LIKE :slug', {
            slug: `%${slug}`,
          });
          options.route += `&slug=${slug}`;
        }
        if (enabled) {
          queryBuilder.andWhere(`themes.enabled = :enabled`, {
            enabled,
          });
          options.route += `&enabled=${enabled}`;
        }
        if (sort) {
          //sort by newest -> oldest
          queryBuilder.orderBy(`themes.createdAt`, `DESC`);
        } else {
          queryBuilder.orderBy(`themes.key`, `ASC`);
        }
      });

    const result = await paginate<ThemeEntity>(queryBuilder, options);

    return new Pagination<ThemeEntity>(
      await Promise.all(
        result.items.map(async (themeHasKey) => {
          const theme = this.themeRepository
            .createQueryBuilder('theme')
            .leftJoinAndSelect('theme.products', `products`)
            .where(`theme.key = :key`, { key: themeHasKey.key })
            .getOne();
          return theme;
        }),
      ),
      result.meta,
      result.links,
    );
  }

  //!GETONE Theme Admin:
  //Nếu MultiLanguage thì thêm params lang vào dto getone
  async findOneThemeAdmin(slug: string) {
    const existTheme = await this.themeRepository
      .createQueryBuilder('theme')
      .where({ slug })
      .leftJoinAndSelect(`theme.products`, `products`)
      .getOne();

    if (!existTheme) {
      throw new NotFoundException(`Not Found Theme`);
    }

    return existTheme;
  }

  //!UPDATEONE Theme Admin:
  async updateOneThemeAdmin(
    key: string,
    updateOneThemeAdminDto: UpdateOneThemeAdminDto,
  ) {
    const { name, image, description, enabled } = updateOneThemeAdminDto;

    const existTheme = await this.themeRepository.findOneBy({ key: key });
    if (!existTheme) {
      throw new NotFoundException('Not Found Theme');
    }

    const existThemeName = await this.themeRepository.findOneBy({
      key: Not(key),
      name: name,
    });
    if (existThemeName) {
      throw new ConflictException(`Duplicate Theme Name`);
    }

    if (updateOneThemeAdminDto) {
      existTheme.name = name;
      existTheme.image = image; //todo: nhập File (chưa làm)
      existTheme.description = description;
      existTheme.enabled = enabled;
    }

    await this.themeRepository.save(existTheme);
    return this.findOneThemeAdmin(this.slugify(key));
  }

  //!DELETEONE Theme Admin:
  async deleteOneThemeAdmin(key: string) {
    //existProductLinked?
    const productLinked = await this.productRepository.findOneBy({
      themeKey: key,
    });
    if (productLinked) {
      throw new ConflictException(`1 Product is linked to this Theme`);
    }

    const [result] = await Promise.all([
      this.themeRepository.softDelete({ key: key, deletedAt: IsNull() }),
      //Problem: nếu có bản multilanguages thì phải softDelete:
      // this.productTranslate.softDelete({
      //   key
      // })

      //Problem: n-n custom 1-n Muốn xóa Category phải xóa hết các Product và Relation Middle liên quan đến Category:
      // this.productsToCategoriesRepo.softDelete({
      //   productsId: key,
      //   deletedAt: IsNull()
      // }),
    ]);

    if (!result.affected) {
      throw new NotFoundException(`Not Found Theme`);
    }
    if (result.affected) {
      return `Delete Success`;
    }

    return result;
  }

  //!DELETEMULTI Themes Admin:
  async deleteMultiThemesAdmin(keys: string[]) {
    //existProductLinked?
    const productLinked = await this.productRepository.findOneBy({
      themeKey: In(keys),
    });
    if (productLinked) {
      throw new ConflictException(`1 Product is linked to 1 Theme`);
    }

    const [result] = await Promise.all([
      this.themeRepository.softDelete({
        key: In(keys),
        deletedAt: IsNull(),
      }),
      //Problem: nếu có bản multilanguages thì phải softDelete:
      // this.productTranslate.softDelete({
      //   key
      // })

      //Problem: n-n custom 1-n Muốn xóa Category phải xóa hết các Product và Relation Middle liên quan đến Category:
      // this.productsToCategoriesRepo.softDelete({
      //   productsId: key,
      //   deletedAt: IsNull()
      // }),
    ]);
    if (!result.affected) {
      throw new NotFoundException(`Not Found 1 Theme`);
    }

    if (result.affected) {
      return `Delete Success`;
    }

    return result;
  }
}
