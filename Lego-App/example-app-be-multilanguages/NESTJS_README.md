### NESTJS:

# 1. Setup:
$ npm install -g @nestjs/cli
$ nest new project-name

-> .eslintrc.js:
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },

# 1.1. Running:
$ npm run start:dev (sử dụng sẽ auto nodemon)

-> Open localhost:3000/

# 1. Module -> Controller(Route) -> Service(Logic) -> Entity(Model) + Repository:
- Tạo tất cả:
  $ nest g resource messages

- Để tạo 1 Module:
  $ nest g module messages

- Để tạo 1 Controller(Route) sử dụng các class và decorator:
  $ nest g controller messages

* Để Controller dùng Service phải có:
  constructor(private readonly tagsService: TagsService) {}

- Để tạo 1 Service(Logic):
  $ nest g service messages

- Để tạo 1 Repository(Lấy dữ liệu Database):
  Tạo file messages.repository.ts

- Với SQL PostgreSQL (phải + không cần tạo Repository riêng): typeorm hỗ trợ ở Service lấy dữ liệu Database
- Với NoSQL MongoDB (phải có Repository riêng): không có typeorm hỗ trợ ở Service để lấy dữ liệu Database

# 2. Validation:
# Để cài Validate Pipe:
$ npm i --save class-validator class-transformer

# Auto Validation - Validate Pipe (Validate Pipe) + DTO (Data Transfer Object):
- Trong main.ts import Global Validate Pipe (hoặc trực tiếp vào Controller):
-> Cách 1: Global main.ts:
import {Validate Pipe}
app.useGlobalPipes(
  new ValidationPipe()
);

-> Cách 2: Method Level controller:
@Post('create')
@UsePipes(ValidationPipe)
createCustomer(
@Body() createCustomerDto: CreateCustomerDTO
) {
this.customersService.createCustomer(createCustomerDto);
}

- Tạo DTO import Validate Pipe:
  -> message.dto
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

- Trong Controller import DTO:
  -> messages.controller:
  import { MessageDTO }
  @Post()
  createMessage(@Body() body: MessageDTO) {
  return this.messagesService.create(body.content);
  }

      Vì Post() là lấy cả User -> có thể dùng UserDTO(UserDTO chứa cả email + username)
      Vì Get('/:email') + Delete('/:email') lấy email -> chỉ được dùng UserParamsDTO.email

# Explicit conversion (Dùng trong Controller) sẽ (ko cần bật Validate Pipe transform: true) ở main.ts:
  @Get(':id')
  findOne(
      @Param('id', ParseIntPipe) id: number,
      @Query('sort', ParseBoolPipe) sort: boolean,
  ) {
      console.log(typeof id === 'number'); // true
      console.log(typeof sort === 'boolean'); // true
      return 'This action returns a user';
  }

# Disable detailed errors:
  app.useGlobalPipes(
      new ValidationPipe({
          disableErrorMessages: true,
      }),
  );

# Stripping properties:
  app.useGlobalPipes(
      new ValidationPipe({
          whitelist: true,
      }),
  );

# Transform payload objects để chuyển đổi auto convert từ string(default) sang type mình muốn:
- Global:
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  @Get(':id')
  findOne(@Param('id') id: number) {
  console.log(typeof id === 'number'); // true
  return 'This action returns a user';
  }

- Method level:
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
  }

# Dùng Mapped types (có thể kết hợp các loại DTO với nhau):
- PartialType() khi có nhiều DTO mà trùng các Validate:
  export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
  }

  export class UpdateCatDto extends PartialType(CreateCatDto) {}

- PickType() lấy 1 kiểu riêng ví dụ lấy age:
  export class UpdateCatAgeDto extends PickType(CreateCatDto, ['age'] as const) {}

- OmitType() chọn các kiểu khác loại trừ 1 kiểu ví dụ loại name:
  export class UpdateCatDto extends OmitType(CreateCatDto, ['name'] as const) {}

- IntersectionType() kết hợp 2 kiểu thành 1 kiểu mới:
  export class UpdateCatDto extends IntersectionType(
  CreateCatDto,
  AdditionalCatDto,
  ) {}

# 3. Not Found Exception:
- Hiển thị lỗi khi không có dữ liệu khi @Get a message
  -> messages.controller.ts import NotFoundException


###### NestJS Project Task Management:
### Task Management (Part 1):
# 3. Validation Pipe: (@IsNotEmpty() DTO)
  $ npm install class-validator class-transformer --save

- DTO createTask.dto.ts:
  import { IsNotEmpty } from 'class-validator';
  
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

- DTO getTasksSearchFilter.dto.ts:
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.IN_PROGRESS])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;

- Controller:
  ...
  @Get()
  getTasksSearchFilter(
    @Query(ValidationPipe) filterDto: GetTasksSearchFilterDto,
  ): Task[] {
  ...
  @Post()
  @UsePipes(ValidationPipe)
  ...

# 4. Error Handling: (throw new NotFoundException(`Task ${id} not found !`);)
- Service:
 getTaskById(id: string): Task {
    const taskFound = this.tasks.find(task => task.id === id);
    if (!taskFound) {
        throw new NotFoundException(`Task ${id} not found !`);
    }
    return taskFound;
  }

# 5. Custom Pipe: (taskStatusValidation.pipe.ts)
- Pipe: 
  export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
      TaskStatus.OPEN,
      TaskStatus.DONE,
      TaskStatus.IN_PROGRESS,
    ];

    transform(value: any) {
      value = value.toUpperCase();

      if (!this.isStatusValid(value)) {
        throw new BadRequestException(`${value} is an invalid status`);
      }

      return value;
    }

    private isStatusValid(status: any) {
      const index = this.allowedStatus.indexOf(status);
      return index !== -1;
    }
  }

- Controller:
  ...
  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }


### Authentication User: (Thêm bớt vào phần dưới)
# 1. Settings:
$ nest g module auth
$ nest g controller auth
$ nest g service auth

- authCredentials.dto.ts: (DTO + ValidationPipe) (Dùng 1 DTO cho cả SignUp SignIn)
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @IsNotEmpty()
  password: string;

- user.entity.ts:
  @Entity()
  @Unique(['username']) //Không trùng lặp username (Optional Xem lại docs TypeOrm thêm luôn unique: true)
  export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;
  }

- user.repository.ts: (Optional)
  @EntityRepository(UserEntity)
  export class UserRepository extends Repository<UserEntity> {}

- auth.module.ts:
  imports: [TypeOrmModule.forFeature([UserRepository])],

- auth.service.ts:
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}


# 2. Sign Up:
- Đã fix lỗi undefined, null value là do DTO
- Duplicate Unique: Error Handler Duplicate Unique username -> user.repository
# Bcrypt Salt + Bcrypt Hash password:
$ npm install bcrypt --save
- user.repository


# 3. Sign In:
# Validation password:
- user.entity
- user.repository
- auth.service
- auth.controller


# 4. JWT JsonWebToken:
$ npm install @nestjs/jwt @nestjs/passport passport passport-jwt

- auth.module.ts:
  PassportModule.register({ defaultStrategy: 'jwt'}), //PassportJS JWT
  JwtModule.register({ //JWT
    secret: 'topSecret',
    signOptions: {
      expiresIn: 3600,
    },
  }),
  TypeOrmModule.forFeature([UserRepository]),

# JwtPayload Sign (For SignIn in AuthService):
  + jwtPayloadInterface.interface.ts:
    export interface JwtPayload { //!JWT Payload for Sign In AuthService
      username: string;
    }

  + auth.service
  + auth.controller

# JwtStrategy Guards (After SignIn, PassportJS Bearer Token) (For Guards in AuthController, TaskController, ...):
  + jwtStrategy.ts:
    export class JwtStrategy extends PassportStrategy(Strategy) { //!JWT Strategy PassportJS for Guards 
      constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
      ) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: 'jwtSecretKey',
          ignoreExpiration: false //Không lựa chọn bỏ qua Token hết hạn
        });
      }

      async validate(payload: JwtPayload): Promise<UserEntity> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ username });

        if (!user) {
          throw new UnauthorizedException('Sign In Failed Strategy !');
        }
        return user;
      }
    }
  + auth.module:
    //...
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule],
  + auth.controller:
    //...
    @Post('/test')
    @UseGuards(AuthGuard())


# 5. Session Cookie: (Bộ nhớ lưu tạm thông tin người dùng (Reset nếu Timeout)) (Optional - Không dùng vì dùng JWT)
$ npm install @nestjs/passport passport @types/passport-local passport-local @types/express
$ npm install @nestjs/jwt passport-jwt @types/passport-jwt cookie-parser @types/cookie-parser
$ npm install express-session @types/express-session


- app.module.ts:
  PassportModule.register({ //PassportJS register Session Cookie
    session: true,
  })

- main.ts:
  //!Session Cookie:
  app.use(session({
    secret: "DAJSJKHJFKJSDSKD", //Bí mật Cho vào .env .gitignore
    resave: false,
    saveUninitialized: false, //Không session cho người ko login
    cookie: {
      maxAge: 60000, //1 phút
    },
  }))

- auth.controller.ts:
  @Get('/session')
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log(session);
    console.log(session.id);

    session.authenticated = true;
    return session;
  }

- SessionCookieSerializer.ts:


- auth.service.ts:
  //!Find User By Id:
  findUserById(id: number) {
    return this.userRepository.findOne(id);
  }

- auth.module.ts:
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SessionCookieSerializer], //JwtStrategy Guards + Session Cookie
  exports: [JwtStrategy, PassportModule], //JwtStrategy Guards

- Use AuthGuard -> Auth Controller (!Xem lai)
# (Đã fix) Lỗi Controller để '/session' không được vì chưa bật session ở app.module.

##############################JOBS###################################
# (Đã Xong) CRUD Topic (Entity MultiLanguage)
  + Đọc NESTJS_CRUD_Topic_Normal&MultiLanguage.md
  + Đọc NESTJS_CRUD_Topic_MultiLanguage.md
# (Đã Xong) CRUD Level (Entity MultiLanguage)
  + Đọc NESTJS_CRUD_Level_MultiLanguage.md
  + (Đã xong) Delete = SoftDelete để bảo vệ dữ liệu người dùng, muốn khôi phục chỉ việc xóa deleteAt trong database là xong, xóa deleteAt ở cả Level lẫn LevelTranslate nếu có MultiLanguage
# (Đã Xong) Slug (Cho CRUD Get All + Search + Pagination) bổ trợ cho tìm kiếm theo title(string) ko phải theo id(number)
# (Đã có hướng dẫn) Searching (not in CRUD get all)
# (Đã Xong) i18n (System MultiLanguage)
# (Chưa xong) Tìm hiểu Swagger (Để Deploy App như đang dùng Postman) (Optional)
##############################CRUD TypeORM PostgreSQL Search Pagination###################################
# (Đã Xong) Relations Đang gặp lỗi Many To Many tạo 1 Task chứa Categories [1,2,3] 2, 3 không tồn tại -> bị Internal server error
# (Đã Xong) Relations Nếu nhập API phải để "categoryIds": [] thì mới được rỗng, nếu ko nhập "categoryIds" thì sẽ lỗi
# (Đã Xong) Relations TypeOrm:
  + JoinColumn() dùng 1 phía  cho OneToOne, ManyToOne (Có thể bỏ qua)
  + JoinTable() dùng 1 phía cho ManyToMany
# (Đã Xong) Relations Custom Relation ManyToMany CRUD:
  + Create Task + Category bị lỗi Category Not Found
# (Đã Xong) Relations OneToOne, Relation ManyToMany change OneToMany + ManyToOne in Tables: "TaskToCategories", "Tasks", "Categories"
# (Đã xong) CRUD Read User By /:username Vì trùng /:id: thay = /username/:username
# (Đã Xong) .env trong Migrations
# (Đã Xong) DBeaver
# (Đã xong) CRUD with MongoDB
# (Chưa Xong) TypeOrm Query Builder in Service
# (Đã Xong) Pagination Infinite Scroll (Phân trang) (Không dùng)
# (Đã xong) Pagination Get All Tasks + Pagination (Phân trang)
# (Đã xong) Paginate + Search FilterByTitle (Phân trang + Tìm kiếm Tasks theo Title)
# (Đã xong) Search Tại sao Search Interface lại Search được DB (Trong Logic có lấy từ Repository)
# (Chưa xong) Search "ba" vẫn tìm thấy "bá" (Dùng ElasticSearch)
# (Chưa Xong) Search ElasticSearch (+ Docker)
# (Chưa xong) Comment
##############################OVERVIEW###################################
# (Đã xong) Middlewares
##############################SERCURITY###################################
# (Đã Xong) SessionCookies (không dùng)
# (Đã Xong) JWTToken (thay cho SessionCookies)

# (Đã xong) Refresh JWT Token (Để bảo mật, không phải đăng nhập lại)
# (Đã Xong) Cookie-parser
# (Đã Xong) Refresh Unauthorized khi lấy refresh token (Vì chưa cài cookie-parser)
# (Đã Xong) Refresh Dùng Access Token mới ko Update được, dùng Access Token cũ thì được
# (Đã Xong) Refresh (Vẫn đúng Logic) vì dùng Access Token mới Update được, dùng Access Token cũ vẫn được

# (Chưa Xong) Firebase
# (Chưa Xong) Login with Firebase
# (Chưa Xong) Verify Link Nodemailer
# (Chưa Xong) Verify Phone Sendgrid Twilio
# (Chưa Xong) Email Google Authent

# (Đã Xong) LogOut xóa hết các token

# (Đã xong) CASL Role, isAdmin, isCreator
# (Đã xong) CASL Super Admin, Normal Admin
# (Đã Xong) CASL add to CRUD Tasks
# (Đã Xong) CASL add to CRUD User //!Lỗi update xong bị sai mật khẩu Login do chưa bcrypt
# (Đã xong) CASL add to CRUD User: Xóa User Xóa Task, Không Xóa Categories (Không để onCascade Delete)

# (Chưa Xong) Helmet
# (Chưa Xong) CORS
# (Chưa Xong) CSRF Protection CSURF
# (Chưa Xong) Rate limiting (Giới hạn tốc độ)
##############################TECHNIQUES###################################
# (Đã xong) Redis
# (Đã xong) Cache In-memory, Cache Manually, Cache Redis (Vote In-memory + Redis, Cache dùng ở Controller)
# (Chưa xong) Serialization (Tạo Custom, Entity: @Exclude-Trả về Loại bỏ hiển thị, @Expose-Trả về Phơi bày, Transform, SerializeOptions() in Controller)
# (Chưa Xong) Versioning (for Microservice)
# (Đã Xong) Task Scheduling (Lịch Tác Vụ * * * * * *)
# (Đã Xong) Queues (Hàng Đợi để tăng hiệu suất)
# (Chưa Xong) Logging (LOG như console.log())
# (Chưa Xong) Cookies
# (Chưa Xong) Events. (Dùng để gửi mail chúc mừng sinh nhật khách)
# (Chưa Xong) Compression (Nén để tăng tốc độ ứng dụng)
# (Chưa Xong) Upload file
# (Chưa Xong) HTTP Module (Axios)
# (Chưa Xong) Server Sent Event (Real-time 1 chiều Đồ thị, News Feed khác WebSockets Real-time 2 chiều Chat Online, Game)
##############################OTHERSFUNDAMETALS###################################
# (Chưa Xong) Transactions (Giao dịch)
# (Đang Làm) Unit Test, E2E
  + Đọc NESTJS_Test_UnitTesting_E2E.md
  + Đang Pending vì cần E2E ở fake database inmemory
# (Chưa Xong) GraphQL
# (Chưa Xong) TypeScript
# (Chưa Xong) Websocket Streaming
# (Chưa xong) Kafka
# (Chưa Xong) Docker (Chứa C#, PHP, NodeJS, Java, ...)
# (Chưa Xong) Microservice (Optional)


##############################JOBS###################################
###### Tìm hiểu Swagger (Optional)
###### Slug bổ trợ cho tìm kiếm theo title(string) ko phải theo id(number)
- Đọc NESTJS_CRUD_Topic_MultiLanguage.md
- Đọc NESTJS_CRUD_Level_MultiLanguage.md


##############################OVERVIEW###################################
###### Middleware:
# 1. Settings:
- create folder middlewares:
  + audit.middleware.ts
    @Injectable()
    export class AuditMiddleware implements NestMiddleware {
        use(req: Request, res: Response, next: Function) {
            console.log("Logging DELETE request Headers ", req.headers);
            next()
        }
    }
- task.module:
  export class TasksModule implements NestModule { //!Middleware
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuditMiddleware)
        .forRoutes({ path: 'tasks/*', method: RequestMethod.DELETE }) //todo: task.controller Delete
    } 
  }

##############################CRUD TypeORM PostgreSQL Search Pagination###################################
###### Cần làm gấp:
- Theo Tasks và Categories
# 1. Database TypeOrm PostgreSQL:
  $ npm install --save @nestjs/typeorm typeorm pg @nestjs/config

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

# 2. Entity: (Model, Thực thể Table in Database)
- Entity task.entity.ts:
  @Entity()
  export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;
  }

# 3. Repository: (Kho Chứa Thực Thể Entity + Service) (Optional)
- Repository task.repository.ts:
  import { TaskEntity } from './task.entity';
  import { EntityRepository, Repository } from 'typeorm';

  @EntityRepository(TaskEntity)
  export class TaskRepository extends Repository<TaskEntity> {}

# 3. Add TypeOrm To Task.Module (Bắt buộc):
- Module tasks.module.ts với custom Repository (Optional):
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  controllers: [TasksController],
  providers: [TasksService],

- Module tasks.module.ts không có custom Repository (Vote):
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  controllers: [TasksController],
  providers: [TasksService],


# 4. uninstall uuid:
$ npm uninstall uuid

# Task Enum Status (Optional):
- taskStatus.enum.ts:
  export enum TaskStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
  }


# 5. Global ValidationPipe DTO:
- main.ts:
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    //!Nếu ko để Global ValidationPipe thì trong Controller phải có ValidationPipe mới dùng được DTO
    //!Nếu để Global ValidationPipe thì bắt buộc phải tạo DTO class-validator @IsNotEmpty
    new ValidationPipe({
      whitelist: true,
    }),
  );

# 6. CRUD (with TypeORM SQL) (Done):
- Promise<void> to return nothing

- Repository task.repository.ts:
- Service tasks.service.ts:
- Controller tasks.controller.ts:

  CRUD
  + Create Task
  + Get All Task + Get All Task Search Filter
  + Update Task's Status
  + Update Task
  + Delete Task

- Not Done:
  + Get All Tasks id không theo thứ tự (chỉnh trong entity), Chưa trả về khi Update + Delete là Đã thành công
  + Get All Tasks Search Filter (gõ title "hianhem" ko tìm được "hi anh em") (Phải dùng Elastic Search nâng cao)

### RequestWithUser: (For Auth, For Relation) (Optional)
- requestWithUser.interface.ts:
  import { UserEntity } from './user.entity';
  import { Request } from 'express';

  export interface RequestWithUser extends Request {
    user: UserEntity;
  }

###### Relation:
# eager: true + eager: false (For OneToMany ManyToOne) (chỉ 1 phía được eager:true, related entities always to be included) 
# cascade: true (saving the related entities)
# @JoinTable (For Many to Many Relation) (chỉ 1 phía được sử dụng)

# App.Module:
  @Module({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot(typeOrmConfig),
      TasksModule,
      AuthModule,
      CategoriesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}

# RequestWithUser.interface.ts

# One to One:
- address to user (One to One):

# One to Many + Many to One:
- eager: true + eager: false (chỉ 1 phía được eager:true, tự động hiển thị relation,
ko cần find({relation: "authorId"})) 

- user.entity.ts: (One to Many):
  ...
  @OneToMany((type) => TaskEntity, (task) => task.user, { eager: true })
  tasks: TaskEntity[];
  ...

- task.entity.ts: (Many to One):
  ...
  @ManyToOne((type) => UserEntity, (user) => user.tasks, { eager: false })
  user: UserEntity;
  ...

- tasks.controller.ts:
  //!Create A Task:
  ...
  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: RequestWithUser,
  ): Promise<TaskEntity> {
    return this.tasksService.createTask(createTaskDto, req.user);
  }
  ...
  //!Get Task By Id:
  async getTaskById(id: number): Promise<TaskEntity> {
    const taskFound = await this.taskRepository.findOne(id, {relations: ['author']});
  ...


- task.repository.ts:
  //!Create A Task:
  ...
    task.author = author;
  ...

- task.service:
  //!Get Task By Id:
  async getTaskById(id: number): Promise<TaskEntity> {
    const taskFound = await this.taskRepository.findOne(id, {relations: ['author']});
  ...

# Many to Many:
- @JoinTable (For Many to Many Relation) (chỉ 1 phía được sử dụng)

- Task:
  + task.entity.ts:
    //...
    @Entity()
    @Unique(['name']) //Không trùng lặp name
    ...
    @ManyToMany(() => CategoryEntity, (category: CategoryEntity) => category.tasks)
    @JoinTable()
    public categories: CategoryEntity[];
    ...

  + createTaskDto.dto.ts:
    @IsNotEmpty()
    categoryIds: number[];

  + task.repository.ts:
    //!Create A Task + Relation Database (author + categories):
    async createTask(createTaskDto: CreateTaskDto, author: UserEntity): Promise<TaskEntity> {
      const { title, description, categoryIds } = createTaskDto;

      const taskNew = new TaskEntity();
      taskNew.title = title;
      taskNew.description = description;
      taskNew.status = TaskStatus.OPEN;
      taskNew.author = author;
      taskNew.categories = [] ; //!ManyToMany Relation Xem lai

      for (let i = 0; i < categoryIds.length; i++) {
        const category = await getRepository(CategoryEntity).findOne(categoryIds[i]);
        taskNew.categories.push(category);
      }

      await taskNew.save();
      return taskNew;
    }

- Category:
  + CRUD + DTO Validate + TypeOrm Entity 

  + category.entity.ts:
    //...
    @Entity()
    @Unique(['name']) //Không trùng lặp name
    ...
    @ManyToMany(() => TaskEntity, (task: TaskEntity) => task.categories)
    public tasks: TaskEntity[];
    ...


# Many to Many (Advanced Custom):
- Phải có eager và cascade để lưu dữ liệu vào database

- task.entity:
  @OneToMany(() => TaskToCategoryEntity, taskToCategory => taskToCategory.task,
    {nullable: true,  eager: true, cascade: true})
  //!eager: true + eager: false (chỉ 1 phía được eager:true, tự động hiển thị relation,
  ko cần find({relation: "authorId"})) 
  //!Cascade, CASCADE để lưu vào database
  //!Không onDelete: "CASCADE" thì Xóa Relation TaskToCategory Không Xóa luôn Task
  // @JoinColumn({ referencedColumnName: 'taskId' })
  public taskToCategories: TaskToCategoryEntity[];

- category.entity:
  @OneToMany(() => TaskToCategoryEntity, taskToCategory => taskToCategory.category,
    {nullable: true, eager: true,
      cascade: true})
  //!eager: true + eager: false (chỉ 1 phía được eager:true, tự động hiển thị relation,
  ko cần find({relation: "authorId"})) 
  //!Cascade, CASCADE để lưu vào database
  //!Không onDelete: "CASCADE" thì Xóa Relation TaskToCategory Không Xóa luôn Category
  // @JoinColumn({ referencedColumnName: 'categoryId' })
  public taskToCategories: TaskToCategoryEntity[];

- taskToCategory.entity:
  @PrimaryGeneratedColumn()
  public taskToCategoryId: number

  @Column()
  public taskId: number

  @Column()
  public categoryId: number
  
  @ManyToOne(() => TaskEntity, (task) => task.taskToCategories, {onDelete: "CASCADE"})
  //!eager: true + eager: false (chỉ 1 phía được eager:true, tự động hiển thị relation,
  ko cần find({relation: "authorId"})) 
  //!Cascade, CASCADE để lưu vào database
  //!{onDelete: "CASCADE"}: Xóa Task Xóa luôn Relation TaskToCategory
  // @JoinColumn({name: 'taskId'})
  public task: TaskEntity

  @ManyToOne(() => CategoryEntity, (category) => category.taskToCategories, {onDelete: "CASCADE"})
  //!eager: true + eager: false (chỉ 1 phía được eager:true, tự động hiển thị relation,
  ko cần find({relation: "authorId"})) 
  //!Cascade, CASCADE để lưu vào database
  //!{onDelete: "CASCADE"}: Xóa Category Xóa luôn Relation TaskToCategory
  // @JoinColumn({name: 'categoryId'})
  public category: CategoryEntity


###### Find by Slug (Not id):
- https://github.com/lujakob/nestjs-realworld-example-app/blob/master/src/article/article.service.ts
- Tạo 1 column slug trong entity
- Trong service cài slug là cái mình muốn tìm kiếm ví dụ key

##############################TECHNIQUES###################################
###### Redis:
- Cài vào ổ C

###### Caching:
# 1. Settings:
- $ npm install cache-manager
  $ npm install -D @types/cache-manager
- Chỉ dùng ở @Get Controller

- task.module:
  CacheModule.register({
    ttl: 5, //thời gian hết hạn của bộ nhớ Cache
    max: 100, //maximum number of items in Cache
  })
# a. Cache In-memory (No Global): (Vote dùng + Cache Redis)
- task.controller, category.controller, user.controller:
  @Controller('tasks')
  @UseInterceptors(ClassSerializerInterceptor) //!In-memory Cache:
  export class TasksController {
  ...
  @Get()
  @UseInterceptors(CacheInterceptor) //!In-memory Cache:
  ...
  }
# b. Cache Manually (No Global): (Tăng hiệu suất)
- task.service:
  constructor: {
    ...
    @Inject(CACHE_MANAGER) //!Cache Manually: 
    private cacheManager: Cache
  }
- invalidating Cache:
+ create folder cacheManually
+ task.service:
  + clearCache(): dùng cho Create Update Delete
  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    })
  }
  ...
  + Create Update Delete:
  async createTask () {
    ...
     await this.clearCache(); //Cache Manually
  } 
- task.controller:
  @Get()
  @UseInterceptors(CacheInterceptor) //!In-memory Cache | Cache Manually:
  @CacheKey(GET_CACHE_KEY) //!Cache Manually
  @CacheTTL(120) //!Cache Manually
# c. Cache Redis (Vote dùng + Cache In-memory):
- Cài Redis
- create folder cacheRedis:
  + redis.module
  + redis.service
- task.module:
    RedisCacheModule, //!Redis Cache
    CacheModule.register({ //!In-memory Cache | Cache Manually:
      ttl: 10, //thời gian hết hạn của bộ nhớ Cache, sau khi xóa sẽ cập nhật danh sách sau 10s
      max: 100, //maximum number of items in Cache
    }),

###### Task Scheduling: (Lập lịch tác vụ - nâng cao)
$ npm install --save @nestjs/schedule
$ npm install --save-dev @types/cron
- app.module:
  imports: [ScheduleModule.forRoot()],
- app.service:
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  //!Task Scheduling:
  //todo: Declarative cron jobs:
  @Cron('* * * * * *') 
  triggerCronJob(){
    // console.log("CronJob in Task Scheduling")
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  triggerCronJobExpression(){
    // console.log("CronJob Expression in Task Scheduling")
  }

  @Cron('4 * * * * *', {
    name: 'messaging',
    timeZone: 'America/New_York'
  })
  triggerCronJobOptions(){
    // console.log("CronJob Options in Task Scheduling")
  }

  //todo: Declarative intervals:
  @Interval(2000)
  triggerCronJobInterval(){
    // console.log("CronJob Interval in Task Scheduling")
  }

  @Interval('messaging', 3500)
  triggerCronJobIntervalOptions(){
    // console.log("CronJob Interval Options in Task Scheduling")
  }

  //todo: Declarative timeouts:
  @Timeout(3000)
  handleTimeout() {
    // console.log("Calling once after timeout of 3s")
  }

  @Timeout('messaging', 3500)
  handleNamedTimeout(){
    // console.log("Calling once after 3.5s based on named timeout")
  }
  

  //todo: Dynamic cron jobs:
  private readonly logger = new Logger(AuthService.name);
  
  @Cron('* * * * * *', {
    name: 'notifications',
  })

  triggerNotificationsDynamicCronJob(){
    // const job = this.schedulerRegistry.getCronJob('notifications');
    // job.stop();
    // // job.start();
    // console.log(job.lastDate())
  }

  addCronJob(name: string, seconds: string){
    // const job = new CronJob(`${seconds} * * * * *`, () => {
    //   this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    // });
    
    // this.schedulerRegistry.addCronJob(name, job);
    // job.start();

    // this.logger.warn(
    //   `job ${name} added for each minute at ${seconds} seconds!`,
    // )
  }

  deleteCron(name: string) {
    // this.schedulerRegistry.deleteCronJob(name);
    // this.logger.warn(`job ${name} deleted!`);
  }

  getCrons() {
    // const jobs = this.schedulerRegistry.getCronJobs();
    // jobs.forEach((value, key, map) => {
    //   let next;
    //   try {
    //     next = value.nextDates().toJSDate();
    //   } catch (e) {
    //     next = 'error: next fire date is in the past!';
    //   }
    //   this.logger.log(`job: ${key} -> next: ${next}`);
    // });
  }

  //todo: Dynamic intervals:
  triggerNotificationsDynamicIntervals(){
    // const interval = this.schedulerRegistry.getInterval('notifications');
    // clearInterval(interval);
  }
  

  addInterval(name: string, milliseconds: number) {
    // const callback = () => {
    //   this.logger.warn(`Interval ${name} executing at time (${milliseconds})!`);
    // };
  
    // const interval = setInterval(callback, milliseconds);
    // this.schedulerRegistry.addInterval(name, interval);
  }

  deleteInterval(name: string) {
    // this.schedulerRegistry.deleteInterval(name);
    // this.logger.warn(`Interval ${name} deleted!`);
  }

  getIntervals() {
    // const intervals = this.schedulerRegistry.getIntervals();
    // intervals.forEach(key => this.logger.log(`Interval: ${key}`));
  }

  
  //todo: Dynamic timeouts:
  triggerNotificationsDynamicTimeout(){
    // const timeout = this.schedulerRegistry.getTimeout('notifications');
    // clearTimeout(timeout);
  }

  addTimeout(name: string, milliseconds: number) {
    // const callback = () => {
    //   this.logger.warn(`Timeout ${name} executing after (${milliseconds})!`);
    // };
  
    // const timeout = setTimeout(callback, milliseconds);
    // this.schedulerRegistry.addTimeout(name, timeout);
  }

  deleteTimeout(name: string) {
    // this.schedulerRegistry.deleteTimeout(name);
    // this.logger.warn(`Timeout ${name} deleted!`);
  }
  
  getTimeouts() {
    // const timeouts = this.schedulerRegistry.getTimeouts();
    // timeouts.forEach(key => this.logger.log(`Timeout: ${key}`));
  }


###### Queues: (Phải ở App.Module - nâng cao)
- Xử lý mượt mà, tăng hiệu suất ứng dụng
$ npm install --save @nestjs/bull bull
$ npm install --save-dev @types/bull

- app.module:
  BullModule.forRoot({ //!Queues Bull.forRoot (phải ở AppModule)
    redis: {  //Redis
      host: 'localhost',
      port: 6379
    }
  }),

  BullModule.registerQueue({ //!Queues Bull.registerQueue
    name: 'message-queue' //todo: MessageProducerService
  }, {
    name: 'file-operation' //todo: FileProducerService
  }),

  ...
  providers: [
    AppService,
    MessageProducerService, //!MessageProducerService Queues Bull
    MessageConsumer, //!MessageConsumer Queues Bull
    FileProducerService, //!FileProducerService Queues Bull
    FileConsumer,  //!FileConsumer Queues Bull
  ],

- message.producer.service.ts: (file.producer.service.ts tương tự)
  @Injectable()
  export class MessageProducerService{ //!MessageProducerService Queues Bull
      constructor(@InjectQueue('message-queue') private queue: Queue) {
      }

      async sendMessage(msg: string) {
          await this.queue.add('message-job', {
              text: msg
          }, {delay: 5000})
      }
  }

- message.consumer.ts: (Logic) (file.consumer.ts tương tự)
  @Processor('message-queue')
  export class MessageConsumer{ //!MessageConsumer Queues Bull
      @Process('message-job')
      messageJob(job: Job<unknown>){
          console.log(`${job.data} MessageConsumer`);
      }
  }

- app.controller:
  @Get('send-message') //!MessageProducerService Queues Bull
  async sendMessage(@Query('msg') msg: string) {
    this.messageProducerService.sendMessage(msg);
    return `${msg} AppController`;
  }


###### Loggers (nâng cao):
- Logger ở LOG (console.log()), Exception filters ở Response ("status": 403, "error": "Forbidden") 


##############################SERCURITY###################################
###### Authentication SignUp SignIn:
# 1. Session Cookies:
$ npm install @nestjs/jwt passport-jwt @types/passport-jwt cookie-parser @types/cookie-parser
$ npm install express-session
- JWT + Session Cookie
- JsonWebToken để người dùng xác thực mới được sử dụng dịch vụ
- authGuard (canActivate) + auth.controller(@Get('protected') Xác thực không cần đăng nhập lại) + main.ts(session) + sessionCookieSerialize + auth.module(register Session)  + LocalGuard (add canActivate SessionCookie)

# 2. JWTToken BearerToken:
# Dùng ưu điểm hơn Session Cookies:
# Remove SessionCookie to use Guard JWTToken return access_token = BearerToken check SessionCookie:
- LogIn return JWTToken access_token
- BearerToken to use in CRUD, xác thực người dùng để có thể CRUD
- main.ts(remove) + auth.module(remove + add JwtModule.register) + localGuard.guard(remove) + auth.service(add loginPayload) + auth.controller (SignIn return this.authService.loginPayloadJWTToken(user);) + jwtStrategy.strategy (add Bearer Token) + jwtAuthGuard ('jwt' to Controller ('/protected'))
- Add UseGuards(JwtAuthGuard) to Task Controller

$ npm install @types/bcrypt bcrypt
$ npm install @nestjs/passport passport @types/passport-local passport-local @types/express
- Dùng Bcrypt để mã hóa Password, dùng Passport để xác thực mật khẩu
- SignUp (hashPassword) + Verify Password: LocalStrategy + ValidateUser: LocalStrategy + LocalStrategy + LocalGuard('local' dán vào Controller SignIn)
- SignIn loginPayloadJWTToken + JWTStrategy + JWTGuard dán vào Controller cần JWTGuard


###### Refresh JWT Token (Để bảo mật, không phải đăng nhập lại):
- (Đã Xong) vì unauthorized khi lấy refresh token (Vì chưa cài cookie-parser)
- (Đã Xong) vì dùng Access Token mới ko Update được, dùng Access Token cũ thì được
- (Đã Xong) (Vẫn đúng Logic) vì dùng Access Token mới Update được, dùng Access Token cũ vẫn được
- Đăng nhập sẽ lưu Access Token + Refresh Token ở Cookie HTTP Only = true
- Đăng nhập sẽ lưu CurrentHashRefreshToken ở UserEntity Database
- Login A tạo ra các token, Login B thì CurrentHashRefreshToken của A sẽ giữ nguyên cho đến khi Login A lại
- Logout sẽ xóa các token đi

- thêm vào .env:
  JWT_REFRESH_TOKEN_SECRET = refreshTokenKey
  JWT_REFRESH_TOKEN_EXPIRES_IN = 864000s

- auth.entity:
  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

- auth.service:
  //!Access Token: (For Login)
  public getCookieWithJwtAccessToken(user: any) {
    console.log("Đang vào AccessToken Service...")

    console.log(user, "User AccessToken Service")

    const payload = {sub: user.id} //todo: send payload to jwtStrategy
    console.log(payload, "payload User AccessToken Service")
    
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_TIME_EXPIRES_IN
    });
    return `Authentication = ${token}; HttpOnly; Path = /; Max-Age = ${process.env.JWT_TIME_EXPIRES_IN}`
  }

  //!Refresh Token: (For Login)
  public getCookieWithJwtRefreshToken(userId: number) {
    const payload  = { userId } //todo: send payload to jwtRefreshTokenStrategy
    console.log(payload, "payload User RefreshToken Service")
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
    });
    const cookie = `Refresh = ${token}; HttpOnly; Path = /; Max-Age = ${process.env.JWT_REFRESH_TOKEN_EXPIRES_IN}`;
    return {
      cookie,
      token
    }
  }

  //!setCurrentRefreshToken Hash: (For UserEntity For Login)
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  //!GetUserIfRFMatches: (For jwtRFStrategy For Refresh)
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    console.log("Đang vào getUserIfRefreshTokenMatches Service...")

    const user = await this.findUserById(userId);
    if (!user) {
      console.log("Ko tìm thấy user")
    }
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
    if (isRefreshTokenMatching) {
      return user;
    } else {
      console.log("RefreshToken Not Matches")
    }
    console.log("Đã xong getUserIfRefreshTokenMatches Service...")
  }

- auth.controller:
  //!SignIn:
  //todo: SignIn save (AccessToken, RefreshToken in Cookie) (CurrentRefreshToken in Database)
  @HttpCode(200)
  @UseGuards(LocalAuthGuard) //!LocalStrategy Xác thực người dùng
  @Post('/signin')
  async signIn(@Request() req: RequestWithUser){ //!req lấy thông tin từ LocalAuthGuard
    const user = req.user;
    user.password = undefined;

    //!Access Token:
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user) 

    //!Refresh Token:
    const { 
      cookie: refreshTokenCookie, 
      token: refreshToken 
    } 
    = this.authService.getCookieWithJwtRefreshToken(user.id);

    //!setCurrentRefreshToken Hash:
    await this.authService.setCurrentRefreshToken(refreshToken, user.id)

    //Cookie:
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    //Return:
    return {
      ...user,
      accessTokenCookie, 
      refreshTokenCookie
    }

  }

- jwtRefreshToken.strategy:
  //!JwtRefreshToken: (For Refresh)
  @Injectable()
  export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token'
  ) {
    constructor(
      private readonly authService: AuthService,
      @InjectRepository(UserRepository) //!@InjectRepository: đưa UserRepository vào Service
      private userRepository: UserRepository, //!private: vừa khai báo vừa injected vừa khởi tạo
    ) {
      super({
        jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
          return request?.cookies?.Refresh;
        }]),
        secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
        passReqToCallback: true,

      });
    }
  
    async validate(request: Request, payload: any) {
      console.log("Đang vào JwtStrategyRefreshToken...")
      console.log(payload, "Payload in JwtStrategyRefreshToken")

      const refreshToken = request.cookies?.Refresh;
      console.log(refreshToken, "RefreshToken in JwtStrategyRefreshToken")

      return this.authService.getUserIfRefreshTokenMatches(refreshToken, payload.userId);
    }

- jwtRefreshToken.guard:
  @Injectable()
  export default class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {}
  
- auth.controller:
  //!Refresh:
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  refresh(@Req() request) {
    console.log("Đang vào Refresh Controller...")
    
    const user = request.user
    console.log(user, "User in Refresh Controller")

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user);
 
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return user;
  }

###### LogOut: (Xóa hết các token liên quan đến JWT, Refresh Token)
- auth.service:
  //!LogOut:  
  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }

  //!RemoveRefreshTokenWhenLogOut: (For LogOut)
  async removeRefreshToken(user:any) {
    return this.userRepository.update(user, {
      currentHashedRefreshToken: null
    });
  }

- auth.controller:
  //!LogOut:
  //todo: LogOut = Access Token -> CurrentRefreshToken = Null
  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.authService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }


###### Đặt tên id: Slugify, Subriber (Dự án)
###### Delete Multiple: (Dự án)

###### Firebase: (Dự án)
- Firebase dùng để Login FB, Gmail (Frontend làm Login)
- Backend chỉ cần lấy uid of user in Firebase xong làm authorize cho CRUD
- User bổ sung thông tin thì sẽ cho vào PostgreSQL, SQL, ...
$ npm install firebase
$ npm install -g firebase-tools
$ npm install firebase-admin --save

- Frontend hbs:
$ npm i hbs
$ npm i @types/hbs
  + main.ts:
  
  
###### TEST E2E: (Dự án)









###### Authorization Role CASL:
# 1. Role User Admin (RBAC):
- role.enum.ts
- role.decorator.ts
- role.guard.ts

- create in userEntity:
  @Column
  role: Role 

- add to taskController:
  @Roles(Role.ADMIN, Role.PREMIUM)
  @UseGuards(JwtAuthGuard, RolesGuard)

- add  providers: [..., RolesGuard] to authModule

- check role from token in login in authService
- (Đã xong) Chỉ hiện user.id chưa hiện user.role trong roleGuard.guard.ts (Sửa login trong Service)

# 2. CASL isAdmin Role + isCreator: (thay cho Role Admin Premium - Chứa cả Super Admin + Admin)
- $ npm i @casl/ability
- userEntity: 
  @Column
  role: Role
  
  @Column
  isAdmin: boolean;
  
- taskEntity:
  @Column
  isPublished: boolean; //xuất bản 

  @Column
  authorId: number;
- create casl-action.enum.ts
- $ nest g module casl
- $ nest g class casl/casl-ability.factory
- add casl.module:
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
- task:
  + task.module:
    imports: [CaslModule]
  + task.controller:
    constructor (
      private caslAbilityFactory: CaslAbilityFactory //add Casl to Role + isCreator
    )
    thêm  (@Req() req: RequestWithUser) vào Update + Delete TaskController
  + task.service
- auth:
  + Tương tự task CRUD

# 3. CASL Advanced: (Dùng để tạo Guard CASL gán vào TaskController, UserController CRUD cho nhanh)
- create IPolicyHandler.handler.ts
- create casl-ability.decorator.ts
- create policiesGuard.guard.ts
- taskController:
  + add
    @UseGuards(JwtAuthGuard, PoliciesGuard) //!JwtAuthGuard + CASL
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, TaskEntity))


###### Helmet:
- Đặt tiêu đề HTTP để bảo mật
- $ npm i --save helmet
- ts.config.json: 



##############################OTHERS###################################
###### Pagination Infinite Scroll (Không dùng):
###### Get All Tasks + Pagination: (Xem nốt)
$ npm i nestjs-typeorm-paginate
(Nếu ko cài được thì chạy cái này trước) $ npm config set legacy-peer-deps true
- task:
  + task.service:
    import {
      paginate,
      Pagination,
      IPaginationOptions,
    } from 'nestjs-typeorm-paginate';
    ...
    async paginate(options: IPaginationOptions): Promise<Pagination<TaskEntity>> {
      const queryBuilder = this.taskRepository.createQueryBuilder('task');
      queryBuilder.orderBy('task.createdAt', 'DESC'); //todo: Mới nhất đến cũ nhất

      return paginate<TaskEntity>(queryBuilder, options);
    }
  + task.controller:
    @Get()
    index(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<TaskEntity>> {
      limit = limit > 100 ? 100 : limit;
      return this.tasksService.paginate({
        page,
        limit,
        route: 'http://localhost:3000/api/tasks',
      });
    }

###### Search FilterByTitle + Pagination: (Xem nốt)
- tasks:
  + tasks.service
  + tasks.controller
  

###### DBeaver hỗ trợ PostgreSQL:

###### MongoDB:
$ npm install --save @nestjs/mongoose mongoose
- .env:
  + CONNECT_MONGODB = mongodb+srv://Kay941997:password@taskmanagement.drrox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
- app.module.ts:
  +  imports: [MongooseModule.forRoot(process.env.CONNECT_MONGODB)],
- CRUD in categories-mongo-db:
  + schema
  + repository (lấy dữ liệu database) (NoSQL ko có typeorm hỗ trợ ở Service nên ko thể gọi trực tiếp Repository ở Service mà phải code ở Repository rồi gọi sang Service)
  + service (logic)
  + controller
  + module (providers: [CategoriesMongoDbService, CategoryMongoRepository] thì mới chạy đc)

  













































































### NESTJS nest-project-2-DI (DI Between Modules Project):
- Tạo 4 Module Computer, CPU, Disk, Power
- Tạo 3 Service CPU, Power, Disk
- Tạo 1 Controller Computer
- main.ts sẽ là Computer Module
- CPU + Disk cần Power
- Computer cần CPU + Disk

# 1. DI @Interface Import & Exports:
-> B1: power.module.ts (exports PowerService, PowerModule)
import { PowerService }

    exports: [PowerService],

-> B2: cpu.module.ts + disk.module.ts (import PowerModule)
import { PowerModule }

    imports: [PowerModule],

-> B3: cpu.service.ts + disk.service.ts (import PowerService)
import { PowerService }

    constructor(private powerService: PowerService) {

    }

    this.powerService.supplyPower()

-> B4: computer.module.ts (import CpuModule, DiskModule)
import { CpuModule }
import { DiskModule }

    imports: [CpuModule, DiskModule],

-> B5: computer.controller.ts (import CpuService, DiskService)
import { CpuService }
import { DiskService }

    constructor(private cpuService: CpuService, private diskService: DiskService) {

    }

    this.cpuService.compute(1,2),
    this.diskService.getData()

### NESTJS nest-project-3-AnDo:
# 1. Interface(Model):
-> user.ts
  export interface User {
  email: string;
  username: string;
  }

-> user.controller:
  constructor(private readonly userService: UserService) {

      }

### Writing Controllers:
    @Get('/:email')
    @HttpCode(204) //!Status Code
    @Redirect('') //!Redirect
    @Header('Cache-Control', 'none') //!Headers
    getUser(
        @Param() params: UserParamsDTO,
        @Req() req: Request //!Request Object
    ): User  {
        return this.userService.getUser(params.email);
    }

# Request & Response:
    import { Request, Response } from 'express';

    @Get(':id') //Get a customer (Res bình thường):
    getCustomer(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
        @Res() res: Response
    ){
        const customer = this.customersService.findCustomerById(id)
        if (customer) {
            res.send(customer);
        } else {
            res.status(400).send({
                msg: 'Customer not found!'
            })
        }
    }

# Exception Filter (thay cho Request, Response):
    @Get('/search/:id') //Get a customer (kiểu Res NestJS):
    searchCustomerById(
        @Param('id', ParseIntPipe) id: number
    ){
        const customer = this.customersService.findCustomerById(id)
        if (customer) return customer
        else throw new HttpException('Customer not found!', HttpStatus.BAD_REQUEST);
    }

# setGlobalPrefix:
    app.setGlobalPrefix('api'); //!Thêm api để dễ setup

### Serialization:
- Là quá trình xảy ra trước khi response

# Exclude Properties (Loại trừ - Ví dụ Filtering Passwords trước khi response):
- model:
  export class SerializeUser {
  username: string;

      @Exclude() //!Serialize Exclude loại trừ password trước khi hiển thị
      password: string;

  }

- service:
  getUsers() {
  return this.users.map((user) => plainToClass(SerializedUser, user))
  }

(Còn tiếp)



###### Project Medium Clone:
### user:
# 1. PostgreSQL Database:
$ npm install pg --save
- (Create Database) CREATE DATABASE nestjsprojectmediumclone;
- (Create Role User) CREATE user mediumcloneuser with encrypted password '123';
- (Allow Role User manage Database) grant all privileges on database mediumclonedatabase to mediumcloneuser;


# 2. TypeOrm Connect Database: (Object Relational Mapping)
$ npm install --save @nestjs/typeorm typeorm@0.2 mysql2

- OrmConfig ormconfig.ts:
  import { ConnectionOptions } from 'typeorm';

  const config: ConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'mediumcloneuser',
    password: '123',
    database: 'mediumclonedatabase',
    entities: [__dirname + '/**/*.entity{.ts,.js}'], //Tags Entity
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'], //Migration
    cli: {
      migrationsDir: 'src/migrations',
    },
  };

  export default config;

- Module app.module.ts:
  @Module({
    imports: [TypeOrmModule.forRoot(ormconfig), TagsModule],
    controllers: [AppController],
    providers: [AppService],
  })


# 3. TypeOrm Migrations (thay cho Synchronize: true) (Thao tác với Database ko cần qua app SQL):
- Migrations: Easy to update, Safe, Not remove data, Not Break Database
- Synchonize: true : Hard to update, Unsafe, Remove data, Break Database

- Package.json package.json:
  "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --config src/ormconfig.ts",
  "db:drop": "npm run typeorm schema:drop",
  "db:create": "npm run typeorm migration:generate -- -n",
  "db:migrate": "npm run typeorm migration:run"

$ npm run db:drop (Delete all tables in database) 
$ npm run db:create CreateTags (Create migration) 
$ npm run db:migrate (To Migrate) 
SELECT * FROM migrations; (Check all migrations)


# 4. TypeOrm Repository Entity (Tạo Table tags, users trong DB mediumclonedatabase):
- Entity tags.entity.ts:
  @Entity({ name: 'tags' })
  export class TagsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    image: string;

    @Column()
    password: string;
  }

- tags.module.ts:
  imports: [TypeOrmModule.forFeature([TagsEntity])], //TypeOrm + Tags Entity
  controllers: [TagsController],
  providers: [TagsService],

- user.module.ts:
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],

- user.service.ts:

# 6. Validation Pipe:
$npm install class-validator
$npm install class-transformer

- Controller user.controller.ts:
  @Post('user')
  @UsePipes(new ValidationPipe())

- DTO createUser.dto.ts:
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

# 7. Config.ts:
  export const JWT_SECRET = 'super-secret-code';

# 8. UserType + UserResponseInterface (Kết quả trả về):
- UserType user.type.js: (No view HashPassword):
  export type UserType = Omit<UserEntity, 'hashPassword'>; //Hiển thị ẩn HashPassword

- UserResponseInterface userResponse.interface.js:
  export interface UserResponseInterface {
    user: UserType & { token: string }; //Hiển thị ẩn HashPassword & Hiện thêm token
  }

- Service user.service.ts:
  buildUserResponse(user: UserEntity): UserResponseInterface {
      return {
        user: {
          ...user,
          token: this.generateJwt(user),
        },
      };
    }

- Controller user.controller.ts:
    @Post('user/register')
    @UsePipes(new ValidationPipe())
    async createUser(
      @Body('user') createUserDto: CreateUserDto,
    ): Promise<UserResponseInterface> {
      const user = await this.userService.createUser(createUserDto);
      return this.userService.buildUserResponse(user);
    }



# 9. Auth Register User + Bcrypt HashPassword + JsonWebToken :
- DTO createUser.dto.ts:
  @IsNotEmpty()
  readonly username: string;
  
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

- Controller user.controller.ts:
  constructor(private readonly userService: UserService) {}

  @Post('user/register')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

- Config.ts:
  export const JWT_SECRET = 'super-secret-code';

- Service user.service.ts:
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or Username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    console.log('newUser', newUser);
    return await this.userRepository.save(newUser);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }

- bcrypt hash password:
  $ npm install bcrypt

  -> Entity user.entity.ts: table database + bcrypt hash password:
    ...,
    @BeforeInsert()
    async hashPassword() {
      this.password = await hash(this.password, 10);
    }

- jsonwebtoken:
  $ npm install jsonwebtoken

  -> Service user.service.ts:
    generateJwt(user: UserEntity): string {
      return sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        JWT_SECRET,
      );
    }


# 10. Auth Login Request (Compare ):
- loginUser.dto.ts:
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

- Service user.service.ts:
   async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      email: loginUserDto.email,
    });

    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }

- Controller user.controller.ts:
  @Post('user/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginDto);
    return this.userService.buildUserResponse(user);
  }

- Entity:
  ...;
  @Column({ select: false })
  password: string;


# 11. Auth Middleware Global (Verify Token JWT Global):
- Controller user.controller.ts:
  ...
  import { Req} from '@nestjs/common';
  import { Request } from 'express';
  import { ExpressRequest } from 'src/typesGlobal/expressRequest.interface';

  ...
  @Get('user')
  async currentUser(
    @Req() request: ExpressRequest,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(request.user);
  }

- Service user.service.ts:
  ...  
   async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  

- Middleware user/middlewares/auth.middleware.ts:
  import { Injectable, NestMiddleware } from '@nestjs/common';
  import { verify } from 'jsonwebtoken';
  import { NextFunction, Response } from 'express';
  import { ExpressRequest } from 'src/typesGlobal/expressRequest.interface';
  import { JWT_SECRET } from 'src/config';
  import { UserService } from '../user.service';

  @Injectable()
  export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {}

    async use(req: ExpressRequest, _: Response, next: NextFunction) {
      if (!req.headers.authorization) {
        req.user = null;
        next();
        return;
      }

      const token = req.headers.authorization.split(' ')[1];

      try {
        const decode = verify(token, JWT_SECRET);
        const user = await this.userService.findById(decode.id);
        req.user = user;
        next();
      } catch (err) {
        req.user = null;
        next();
      }
    }
  }


- app.module.ts:
  ...
  export class AppModule {
    configure(consumer: MiddlewareConsumer) { //Middleware Global
      consumer.apply(AuthMiddleware).forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
    }
  }

- user.module.ts:
  ...
  exports: [UserService],


# 12. User Decorator Custom:
- Không phải viết nhiều logic trong Controller
- Dễ đọc và đính kèm mọi nơi

- user.decorator.ts:
    export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();

      if (!request.user) {
        null;
      }

      if (data) {
        return request.user[data];
      }

      return request.user;
    });

- user.controller.ts:
  @Get('user')
  async currentUser( @User() user: UserEntity ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }

# 13. Auth Guard: (Không có Token JWT không xác nhận)
- auth.guard.ts:
  @Injectable()
  export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<ExpressRequest>();

      if (request.user) {
        return true;
      }

      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }
  }


- auth.module.ts:
  ...
  providers: [UserService, AuthGuard],

- user.controller.ts:
  ...
  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user);
  }


### article:
# CRUD Create + Relation DB articles with user: 
- $ npm g Module -> Controller -> Service -> Entity(Table Database)
- $ npm run db:create CreateArticles
- $ npm run db:migrate

- TypeOrm Relations Database:
  + user.entity.ts (@OneToMany):
    ...
    @OneToMany(() => ArticleEntity, (article) => article.author)
    articles: ArticleEntity[];

  + article.entity.ts (@ManyToOne):
    ...
    @ManyToOne(() => UserEntity, (user) => user.articles)
    author: UserEntity;

  + $ npm run db:create AddRelationsBetweenArticleAndUser
  + $npm run db:migrate

  + article.module.ts:
    imports: [TypeOrmModule.forFeature([ArticleEntity])],
    controllers: [ArticleController],
    providers: [ArticleService],

- createArticle.dto.ts
- article.service.ts
- article.controller.ts
























# 2.1. Decorator @Get(), @Post(), @Put(), @Delete(), @Patch(), @Options(), @Head(), @All() & Request Object @Req:

    cats.controller.ts

    import { Controller, Get, Post, Req } from '@nestjs/common';
    import { Request } from 'express';

    @Controller('cats')
    export class CatsController {
        @Get()
        findAll(@Req() request: Request): string {
            return 'This action returns all cats';
        }

        @Post()
        create(): string {
            return 'This action adds a new cat';
        }
    }

# 2.2. Route wildcards:

- Match any combination of characters
  @Get('/ab\*cd')
  findAll() {
  return 'This route uses a wildcard';
  }

# 2.3. Status Code:

- Status code mặc định là 200 và của Post là 201
- Thay đổi status code bằng cách thêm @HttpCode:
  import {HttpCode} from the '@nestjs/common'

  @Post()
  @HttpCode(204)
  create() {
  return 'This action adds a new cat';
  }

# 2.4. Headers:

- Thay đổi tiêu đề Header:
  import {Header} from the '@nestjs/common'

  @Post()
  @Header('Cache-Control', 'none')
  create() {
  return 'This action adds a new cat';
  }

# 2.5. Redirect:

- statusCode mặc định là 302 (Found)
- Gồm 2 thành phần url, statusCode
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
  if (version && version === '5') {
  return { url: 'https://docs.nestjs.com/v5/' };
  }
  }

# 2.6. CRUD:
