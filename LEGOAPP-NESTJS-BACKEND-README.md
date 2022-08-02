###### Solution Problems:
# (Problems) Relations:
- Themes (1 - n) Products
- Products (n - n) Categories -> tạo trung gian productToCategory

# (Problems) Repository:
- Repository Custom 0.2 không hoạt động bản TypeOrm 0.3.0
- Tạo Repository Custom 0.3:
  + @Injectable()
    export class ProductRepository extends Repository<ProductEntity> {
      constructor(private dataSource: DataSource) {
        super(ProductEntity, dataSource.createEntityManager());
      }
    }
# (Problems) CREATE: (slug)
- check existProductKey? (vì unique)
- existProductName? (vì unique)
- existThemeKey? (vì relation)
- tạo slug theo key
- (optional) with multilanguages
# (Problems) READ ALL:
- Hiển thị route phải để các slug, enabled, status có giá trị, ko được undefined (where(() => {if else}))
- Pagination limit = 10 phải đếm theo productKey chứ ko phải productsToCategoriesKey (chia nhỏ ra)
- (optional) enabled = 1 hiện cho client, enabled = 1, -1 hiện cho admin
- (optional) hiện tất cả relation liên quan
- (optional) Client Không có GETALL Products, chỉ có GETONE Product
- (optional) with multilanguages
- (optional) Client: GET Recommended For You Products Client (Lấy 12 cái Products từ các Themes khác nhau, thông qua lượt xem, yêu thích)
- (optional) Client: GET Bestsellers Products Client (Lấy 6 cái Products xếp theo lượt user mua vd: usersToProducts)
- (optional) Client: GET Offers and Promotions Themes Client (Lấy 3 cái Themes createdAt mới nhất)
- (optional) Client: GET Read All About It Categories Client (Lấy 4 cái Categories createdAt mới nhất)
- (optional) Client: GET FEATURED SETS Products Client: (Lấy 13 cái Products createdAt mới nhất)
# (Problems) READ ONE: (slug)
- (optional) enabled = 1 hiện cho client, enbaled = 1, -1 hiện cho admin
- (optional) hiện tất cả relation liên quan
- (optional) Client GETONE Product -> show thông tin 1 Product
- (optional) Client GETONE Theme -> show Theme's Products có Pagination, Sort
- (optional) Client GETONE Category -> show Category's Products có Pagination, Sort
- (optional) with multilanguages
# (Problems) UPDATE: (key)
- check existProduct?
- check existProductName by other Product?
- check existThemeKey? (các relation liên quan có tồn tại?)
- (optional) with multilanguages
# (Problems) DELETE: (key)
- check existProduct?
- softDelete Product
- (optional) softDelete multilanguages
- (optional) softDelete các relation liên quan

# (Problems) DELETE MULTIPLES: (keys[])
- check existProducts?
- softDelete Products
- (optional) softDelete multilanguages
- (optional) softDelete các relation liên quan
- (Đã xong) SoftDelete Multiples Theme bị lỗi chỉ xóa cái đầu tiên (Do không nhập đúng url) (Phải nhập localhost:3000/api/admin/themes?keys=theme a,theme d,theme l thì mới được)

# (Problems) image = file
# (Problems) Authentication: (Xác thực)
# (Problems) Authorization: (Phân quyền)
# (Problems) Search (by User, History Search)
# (Problems) Checkout: (Thanh toán)

###### 1. Settings:
$ npm install -g @nestjs/cli
$ nest new project-name
-> .eslintrc.js:
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },

###### 2. Running:
$ npm run start:dev (sử dụng sẽ auto nodemon)
-> Open localhost:3000/

###### 3. Tạo tất cả: 
  $ nest g resource messages

- Để tạo 1 Module:
  $ nest g module messages
  
- Để tạo 1 Controller(Route) sử dụng các class và decorator:
  $ nest g controller messages

- Để tạo 1 Service(Logic):
  $ nest g service messages

- Để tạo 1 Repository(Custom):
  Tạo file messages.repository.ts

- Với SQL PostgreSQL (phải + không cần tạo Repository riêng): typeorm hỗ trợ repository ở Service lấy dữ liệu Database
- Với NoSQL MongoDB (phải có Repository riêng): không có typeorm hỗ trợ repository ở Service để lấy dữ liệu Database

###### 4. GlobalPrefix:
- main.ts:
  app.setGlobalPrefix('api');


###### 5. Entity: (Model, Thực thể Table in Database)
- product.entity.ts:
    import { BaseEntity } from '../../commons/entities/base.entity';
    import {
      Column,
      Entity,
      OneToMany,
      PrimaryColumn,
      PrimaryGeneratedColumn,
    } from 'typeorm';
    import { BooleanEnum } from '../../commons/constants/global.constant';
    import { ProductsToCategoriesEntity } from './products-to-categories.entity';

    @Entity({ name: 'product' })
    export class ProductEntity extends BaseEntity {
      @PrimaryColumn()
      key!: string;

      @Column()
      slug: string;

      @Column()
      // { unique: true }
      name: string;

      @Column({
        nullable: true,
      })
      image: string;

      @Column({
        nullable: true,
      })
      price: number;

      @Column({
        nullable: true,
      })
      description: string;

      @Column({ enum: BooleanEnum, default: BooleanEnum.TRUE })
      enabled: BooleanEnum;
      // TRUE = 1, FALSE = -1 ("Available now" client and admin can + "Disable" only admin can see)

      @Column({ enum: StatusEnum, default: StatusEnum.AVAILABLE })
      status: StatusEnum;

      //todo: Themes

      //todo: Categories
      @OneToMany(
        () => ProductsToCategoriesEntity,
        (productsToCategories) => productsToCategories.product,
        {
          cascade: ['insert'],
        },
      )
      productsToCategories: ProductsToCategoriesEntity[];
    }


###### 6. Repository: (Kho Chứa Thực Thể Entity + Service) (Optional)
- Repository task.repository.ts:
  import { EntityRepository, Repository } from 'typeorm';
  import { ProductEntity } from './../entities/product.entity';

  @EntityRepository(ProductEntity)
  export class ProductRepository extends Repository<ProductEntity> {}

###### 7. Add TypeOrm To product.module (Bắt buộc):
- Module tasks.module.ts với custom Repository (Optional):
  @Module({
    imports: [
      TypeOrmModule.forFeature([
        ProductRepository,
        ProductsToCategoriesRepository,
      ]),
    ],
    controllers: [ProductAdminController, ProductClientController],
    providers: [ProductAdminService, ProductClientService],
  })
  export class ProductModule {}


###### 8. Database - TypeOrm - PostgreSQL - 0.2.45:
$ npm install --save @nestjs/typeorm typeorm pg @nestjs/config

Bản typeorm 0.2.45:
$ npm run migration:generate 'init-product'

Bản typeorm 0.3.5:
$ npm run migration:generate ./migrations/init-product

- ormconfig.js
  let dbConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    migrationsRun: false,
    synchronize: false,
    logging: false,

    migrations: ['dist/migrations/*.js'],
    entities: ['**/*.entity.js'],
    
    cli: {
      migrationsDir: 'migrations', // create migration file and save to this folder
    },
  };
  
  switch (process.env.NODE_ENV) {
    case 'development':
      dbConfig = {
        ...dbConfig,
        migrationsRun: true,
        logging: false,
      };
      break;
    case 'test':
      dbConfig = {
        ...dbConfig,
        // type: 'sqlite',
        migrationsRun: true,
        entities: ['**/*.entity.ts'],
      };
      break;
    case 'production':
      dbConfig = {
        ...dbConfig,
      };
      break;
  
    default:
      throw new Error('unknow environment typeorm config');
  }
  
  module.exports = dbConfig;
  

- app.module.ts:
  imports: [TypeOrmModule.forRoot(), TasksModule],
  controllers: [AppController],
  providers: [AppService],

- package.json:
  scripts: [
    "typeorm": "node --require ts-node/register node_modules/typeorm/cli.js",
    "migration:create": "npm run build && npm run typeorm migration:create -- -n",
    "migration:generate": "npm run build && npm run typeorm migration:generate -- -n",
    "migration:up": "npm run build && npm run typeorm migration:run",
    "migration:down": "npm run build && npm run typeorm migration:revert"
  ]

  "typeorm": "^0.2.45",

  
###### 9. Validation Pipe CRUD DTO:
- Để cài Validate Pipe:
$ npm i --save class-validator class-transformer

-> Cách 1: Global main.ts:
    import {Validate Pipe}
    app.useGlobalPipes(
      new ValidationPipe()
    );

-> Cách 2: Not Global level.controller:
    @Post('create')
    @UsePipes(ValidationPipe)
    createMessage(@Body() body: MessageDTO) {
        return this.messagesService.create(body.content);
    }

- example.dto:
    import { IsString } from 'class-validator'
    export class MessageDTO {
        @IsString()
        content: string
        @IsEmail()
        @IsDefined()
        @IsNotEmpty()
        //Đối với address: Tạo CreateAddressDTO
        @IsNotEmptyObject() //-> Không để trống Object
        @ValidateNested() //-> Để Validate 1 Object ví dụ: Address(line1,line2,zip,city)
        @Type(() => CreateAddressDTO) //-> Định dạng kiểu
        address: CreateAddressDTO;
    }

- example.controller:
    @Post()
    createMessage(@Body() body: MessageDTO) {
        return this.messagesService.create(body.content);
    }

###### 10. CRUD (Admin):
# Constructor in Service:
- product-admin.service.ts:
  constructor(
    // private productRepository: ProductRepository, //!Custom Repository không dùng được ở bản TypeOrm mới 0.3.0
    // private productRepository: Repository<ProductEntity>,
    // @Inject('PRODUCT_REPOSITORY')
    //private productRepository: ProductRepository

    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}
# CREATE Product Admin:
- create-product-admin.dto.ts:
  import {
    IsString,
    MinLength,
    MaxLength,
    IsOptional,
    IsNotEmpty,
    IsNumber,
    IsEnum,
  } from 'class-validator';
  import { BooleanEnum, StatusEnum } from '../../commons/constants/global.constant';

  export enum BooleanEnum {
    TRUE = 1, //show for client and admin can see
    FALSE = -1, //show for only admin can see
  }

  export enum StatusEnum {
    AVAILABLE = 'available',
    DISABLE = 'disable',
    SOLD_OUT = 'sold-out',
    HARD_TO_FIND = 'hard-to-find',
  }


  export class CreateProductAdminDto {
    @IsString()
    @MinLength(5)
    @MaxLength(50)
    @IsNotEmpty()
    key: string;

    @IsString()
    @MinLength(5)
    @MaxLength(50)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(50)
    @MaxLength(255)
    @IsOptional()
    image: string;

    @IsNumber()
    @IsOptional()
    price: number;

    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsOptional()
    description: string;

    @IsEnum(BooleanEnum)
    @IsOptional()
    enabled: BooleanEnum;

    @IsEnum(StatusEnum)
    @IsOptional()
    status: StatusEnum;
  }

- product-admin.service.ts:
  //!CREATE:
  async createProductAdmin(
    createProductAdminDto: CreateProductAdminDto,
  ): Promise<ProductEntity> {
    const { key, name, image, price, description, enabled, status } =
      createProductAdminDto;

    const existProduct = await this.productRepository.findOneBy({ key: key });
    if (existProduct) {
      throw new ConflictException(`Duplicate Product`);
    }

    const newProduct = await this.productRepository.create(
      createProductAdminDto,
    );
    newProduct.slug = this.slugify(key);

    return this.productRepository.save(newProduct);
  }

- product-admin.controller.ts:
  //!CREATE:
  @Post()
  async createProductAdmin(
    @Body() createProductAdminDto: CreateProductAdminDto,
  ): Promise<ProductEntity> {
    return this.productAdminService.createProductAdmin(createProductAdminDto);
  }

# GETALL Products Admin:
  - Problem 1: Hiển thị route thì phải show các slug, enabled, status nếu có chứ ko được hiện undefined
    + Ví dụ: Không được localhost:/products?slug=undefined&enabled=1&status=available
  - Problem 2: Paginate limit=10 đếm theo tổng productToCategory chứ ko phải tổng product

- find-all-products-admin.dto.ts:
  export class FindAllProductsAdminDto {
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    @IsOptional()
    slug?: string;

    @IsEnum(BooleanEnum)
    @Type(() => Number) //để tìm được boolean=number vd: localhost:/product?enabled=1
    @IsOptional()
    enabled: BooleanEnum;

    @IsEnum(StatusEnum)
    @Type(() => String) //để tìm được boolean=string vd: localhost:/product?status=sold-out
    @IsOptional()
    status: StatusEnum;
  }

- product-admin.service.ts:
  //!GETALL Products Admin:
  async findAllProductsAdmin(
    options: IPaginationOptions, //page, limit
    params: FindAllProductsAdminDto, //slug, enabled, status
  ): Promise<Pagination<ProductEntity>> {
    const { slug, enabled, status } = params;

    const queryBuilder = await this.productRepository.createQueryBuilder(
      'products',
    );
    queryBuilder
      .select('products.key')
      .groupBy('products.key')
      .where(() => {
        //Solution Problem 1: Hiển thị route thì phải show các slug, enabled, status nếu có chứ ko được hiện undefined
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
      })
      .orderBy('products.key', 'ASC');

    const result = await paginate<ProductEntity>(queryBuilder, options);

    //Solution Problem 2: Paginate limit=10 đếm theo tổng productToCategory chứ ko phải tổng product
    return new Pagination<ProductEntity>(
      await Promise.all(
        result.items.map(async (productHasKey) => {
          const product = await this.productRepository
            .createQueryBuilder('products')
            // .leftJoinAndSelect('', '')
            .where('products.key = :key', { key: productHasKey.key })
            .getOne();
          return product;
        }),
      ),
      result.meta,
      result.links,
    );
  }

- product-admin.controller.ts:
  //!GETALL Products Admin:
  @Get()
  async findAllProductsAdmin(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() params: FindAllProductsAdminDto,
  ): Promise<Pagination<ProductEntity>> {
    limit = limit > 100 ? 100 : limit;

    return this.productAdminService.findAllProductsAdmin(
      {
        page,
        limit,
        route: `http://localhost:${process.env.PORT}/api/admin/products?`,
      }, //admin có thể không cần route, route cho SEO bên client
      params,
    );
  }







