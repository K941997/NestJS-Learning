##############################JOBS###################################
###### Tìm hiểu Swagger (Optional)
###### Slug bổ trợ cho tìm kiếm theo title(string) ko phải theo id(number)

###### CRUD Topic Normal:
- $ nest g resource topic
- (Chưa xong) Admin: Create Topic, Get All Search + Pagination, Get One by Key=Slug, Update One, Delete One, Delete Multi
- (Xong) Client: Get All No Search + No Pagination

# common/entities/base.entity.ts:
  import {
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    VersionColumn,
  } from 'typeorm';
  
  export class BaseEntity {
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;
  
    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
    deletedAt: Date;
  
    @VersionColumn({ default: 1 })
    version: number;
  }
  

# Entity:
export class Topic extends BaseEntity {
    @PrimaryColumn({
    })
    key: string

    @Column({
        nullable: true
    })
    slug: string

    @Column({
        nullable: true,
    })
    description: string

    @OneToMany(() => TopicTranslate, (topicTranslate: TopicTranslate) => topicTranslate.key,
        {nullable: true, eager: false, cascade: true}
    )
    topicTranslates: TopicTranslate[]
}

# Create A Topic by Admin with KeySlug:
- service:
 slugify(key: string) { //Key -> Slug
    return slug(key, {lower: true}).toString(36)
  }
  async createByAdmin(createTopicDto: CreateTopicDto): Promise<Topic> {
    const topic = this.topicRepository.create( createTopicDto );
    topic.slug = this.slugify(createTopicDto.key);
    try {
      await this.topicRepository.save(topic);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException(
          'Duplicate Description already exists',
        );
      } 
      else {
        throw new InternalServerErrorException();
      }
    }
    return topic;
  }
- controller:
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicService.createByAdmin(createTopicDto);
  }

# Get All Topic + SearchFilter + Pagination with KeySlug:
- service:
  getAllPaginate(options: IPaginationOptions): Observable<Pagination<TopicInterface>> {
    const queryBuilder = this.topicRepository.createQueryBuilder('topic');
    // queryBuilder.orderBy('topic.createdAt', 'DESC'); //todo: New to Old
    queryBuilder.orderBy('topic.key', 'ASC');
    return from (paginate<TopicInterface>(queryBuilder, options));
  }

  searchFilterPaginate(options: IPaginationOptions, topic: TopicInterface): Observable<Pagination<TopicInterface>>{
    return from(this.topicRepository.findAndCount({
        skip: Number(options.page) * Number(options.limit) || 0, //!page * limit = offset
        take: Number(options.limit) || 10,
        order: {key: "ASC"},
        // relations: ['author', 'taskToCategories'],
        select: ['key', 'slug', 'description'], //add more from interface
        where: [
            { slug: Like(`%${topic.slug}%`)}
        ]
    })).pipe(
        map(([topics, totalTopics]) => {
            const topicsPageable: Pagination<TopicInterface> = {
                items: topics,
                links: {
                    first: options.route + `?limit=${options.limit}`,
                    previous: options.route + ``,
                    next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                    last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalTopics / Number(options.limit))}`
                },
                meta: {
                    currentPage: Number(options.page),
                    itemCount: topics.length,
                    itemsPerPage: Number(options.limit),
                    totalItems: totalTopics,
                    totalPages: Math.ceil(totalTopics / Number(options.limit))
                }
            };              
            return topicsPageable;
        })
      ) 
  }
- controller:
  @Get()
  index(
    @Query('page') page: number = 1, //page * limit = offset
    @Query('limit') limit: number = 10,
    @Query('slug') slug: string
  ): Observable<Pagination<TopicInterface>> {
      limit = limit > 100 ? 100 : limit;
      if (slug === null || slug === undefined) {
        return this.topicService.getAllPaginate(
          {
            page: Number(page), 
            limit: Number(limit), 
            route: 'http://localhost:5000/admin/topics',  
          },
        );
    } else if (slug) {
        return this.topicService.searchFilterPaginate(
            {
              page: Number(page),
              limit: Number(limit),
              route: 'http://localhost:5000/admin/topics',
            },
            { slug }
        );
    }
  }

# Get All by Client with KeySlug:
- service:
 async findAllByClient(): Promise<Topic[]> {
    const query = this.topicRepository.createQueryBuilder('topic')
    .orderBy("topic.key");
    const allTopics =  await query.getMany();
    return allTopics;
  }

# Get One by Admin with KeySlug:
-service:
  async findOneByAdminKeySlug(slug: any): Promise<Topic> {
      const topic = await this.topicRepository.findOne(slug);
      if (!topic) {
        throw new NotFoundException(`Topic not found !`);
      } else {
        return topic;
      }
  }
- controller:
  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<Topic> {
    return await this.topicService.findOneByAdminKeySlug({slug});
  }

# Update A Topic by Admin with KeySlug:
- Nếu update title, ko update description thì phải thêm @IsOptional() vào DTO hoặc custom decorator
- dto:
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  // @IsValidArrayNumber() //custom decorator nếu ko dùng @IsOptional()
  topicTranslate: number[];

- service:
  const topicToUpdate = await this.topicRepository.findOne({slug: slug});
  if (!topicToUpdate) {
    throw new NotFoundException(`Topic not found !`);
  } else {
    const { description, topicTranslate } = updateTopicDto;
    // if (key) { //!Cant update key because is is Primary Key
    //   topicToUpdate.key = key;
    //   topicToUpdate.slug = this.slugify(updateTopicDto.key);
    // }
    if (description != undefined || description) { topicToUpdate.description = description }
    return this.topicRepository.save(topicToUpdate)
  }

- controller:
  @Patch(':slug')
  async update(@Param() param, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicService.updateByAdmin(param.slug, updateTopicDto);
  }

# Delete A Topic by Admin with KeySlug:
- service:
  async removeByAdmin(slug: string): Promise<DeleteResult> {
    const topicToDelete = await this.topicRepository.findOne({slug: slug});
    if (!topicToDelete) {
      throw new NotFoundException(`Topic not found !`);
    } else {
      return await this.topicRepository.delete({ slug: slug});
    }
  }

- controller:
  @Delete(':slug')
  remove(@Param() param ) {
    return this.topicService.removeByAdmin(param.slug);
  }

# Delete Multiples Topics by Admin with KeySlug:
- service:
  async removeMulti(slugs: string[]){
    const topics = await this.topicRepository.find({
      slug: In(slugs)
    })
    console.log(slugs)
    topics.filter(topic => !slugs.includes(topic.slug))
    const { affected } = await this.topicRepository.delete({slug: In(slugs)})
    if (affected === 0) {
      throw new BadRequestException('Product Multi not found')
    }
  }

- controller:
  @Delete()
  removeMulti(
    // @Param('slugs', ParseArrayPipe) slugs: string[]
    @Query('slugs', ParseArrayPipe) slugs: string[]
    // @Body() deleteTopicMulti: DeleteTopicMultiDto
  ){
    // return this.topicService.removeMulti(deleteTopicMulti.slugs) //@Body
    return this.topicService.removeMulti(slugs)
  }


###### CRUD Topic with Multiples Language: (i18n Library)
$ npm install --save nestjs-i18n

- i18n
  + en main.js
  + vi main.js

- nest-cli.json
  + {
      "collection": "@nestjs/schematics",
      "sourceRoot": "src",
      "compilerOptions": {
        "plugins": ["@nestjs/swagger"],
        "assets": [
          { "include": "i18n/**/*", "watchAssets": true }
        ]
      }
    }

- global.constants.ts
  + export enum BooleanEnum {
        TRUE = 1,
        FALSE = -1,
    }
    export const KEY_LANG_HEADER = 'lang';
    export enum LangEnum {
      Vi = 'vi',
      En = 'en',
    }
    
- i18n.config.ts
  const i18nConfigOptions: I18nOptions = {
    fallbackLanguage: LangEnum.Vi, // Not work if change to vi
    fallbacks: {
      // 'en-CA': 'fr',
      // vi: 'vi',
      'en-*': 'en',
      // 'fr-*': 'fr',
      // pt: 'pt-BR',
    },
    loader: I18nJsonLoader,
    loaderOptions: {},
    // Path not work here
    // parserOptions: {
    //   path: '../../i18n/', //path.join(__dirname, '/i18n/'),
    //   watch: true,
    // },
    resolvers: [
      { use: QueryResolver, options: [KEY_LANG_HEADER] },
      new HeaderResolver([KEY_LANG_HEADER]),
      AcceptLanguageResolver,
      // new CookieResolver(['lang', 'locale', 'l']),
    ],
  };

- app.module
+   I18nModule.forRoot({
      ...i18nConfigOptions,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),

- topic.entity:
    @PrimaryColumn()
    key: string

    @Column({
        nullable: true
    })
    slug: string

    @Column({
        nullable: true,
    })
    description: string

    @Column({ enum: BooleanEnum, default: BooleanEnum.FALSE })
    enabled: BooleanEnum;

    @OneToMany(() => TopicTranslation, (topicTranslate: TopicTranslation) => topicTranslate.topic,
    {
        cascade: ['insert'],
    },
    )
    translates: TopicTranslation[]   

- topic-translation.entity:
   @PrimaryGeneratedColumn({
    })
    id: number

    @ColumnString({ unique: true })
    name: string;
  
    @ColumnString({ default: LangEnum.Vi, enum: LangEnum })
    lang: LangEnum;
  
    @Column({ name: 'topic_key'})
    topicKey: string;
  
    @ManyToOne(() => Topic, (topic) => topic.translates, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'topic_key'})
    topic: Topic;

- create-topic.dto.ts (dành cho cả 2 entity):
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsNotEmpty()
  key: string; //lấy slug theo key

  @IsString()
  @IsOptional()
  description: string;

  @IsValidText({ minLength: 6, maxLength: 20 })
  name: string;

  @ApiHideProperty()
  @Default(LangEnum.Vi)
  lang: LangEnum;

  @IsValidEnumNumber({ enum: BooleanEnum, default: BooleanEnum.FALSE })
  enabled: BooleanEnum;

- update-topic.dto.ts:
  @IsValidText({ minLength: 6, maxLength: 20 })
  name: string;

  @IsValidEnumString({ enum: LangEnum })
  lang: LangEnum;

- translate.service:
  constructor(private readonly i18n: I18nService) {}

  async t(key: DottedLanguageObjectStringPaths, options?: TranslateOptions) {
    const data = await this.i18n.t(key, options);
    return data;
  }

- translate.interface (import * as mainJson from '../../i18n/vi/main.json';)
    /* eslint-disable prettier/prettier */
    import * as mainJson from '../../i18n/vi/main.json';
    import { ENTITY_LANG, MAIN_LANG } from '../constants/global.constant';
    /**
    * If you update file localize, it will not effect immidiately
    * You need to shutdown vs code and restart it again, some cache issue here.
    */
    const langData = {
      [MAIN_LANG]: { ...mainJson },
    };

    type PathsToStringProps<T> = T extends string
      ? []
      : {
          [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
        }[Extract<keyof T, string>];

    type Join<T extends string[], D extends string> = T extends []
      ? never
      : T extends [infer F]
      ? F
      : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
      : string;

    export type DottedLanguageObjectStringPaths = Join<
      PathsToStringProps<typeof langData>,
      '.'
    >;

- tsconfig.json:
  "resolveJsonModule": true,
  "allowJs": true
  + (Lỗi đẻ ra nhiều file js nếu thêm sai)
  + (Lỗi i18n not found nếu không thêm )
  + (Không lỗi khi có translate.interface (import * as mainJson))

- topic.service:
  + findOneTransWith





###### Topic Service:
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, In, Like, Not, Repository } from 'typeorm';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { from, map, Observable } from 'rxjs';
import { TopicInterface } from './entities/topic.interface';
import { TopicTranslation } from './entities/topic-translation.entity';
import { FindConditions } from 'typeorm';
import { TranslateService } from '../utils-module/services/translate.service';
import { ConflictExc, NotFoundExc } from '../common/exceptions/custom.exception';
import { FindTopicDto } from './dto/find-topic.dto';

const slug = require('slug');

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicTranslation)
    private topicTransRepo: Repository<TopicTranslation>,

    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,

    private translateService: TranslateService,
  ){}

  slugify(key: string) {
    return slug(key, {lower: true}).toString(36)
  }

  //!Admin Create (Normal):
  // async createByAdmin(createTopicDto: CreateTopicDto): Promise<Topic> {
  //   const topic = this.topicRepository.create( createTopicDto );
  //   topic.slug = this.slugify(createTopicDto.key); //!Slug
  //   try {
  //     await this.topicRepository.save(topic);
  //   } catch (err) {
  //     if (err.code === '23505') {
  //       throw new ConflictException(
  //         'Duplicate Description already exists',
  //       );
  //     } 
  //     else {
  //       throw new InternalServerErrorException();
  //     }
  //   }
  //   return topic;
  // }

  //!Admin Create Topic (MultiLanguage):
  async findOneTransWith(opts: FindConditions<TopicTranslation>) {
    const exist = await this.topicTransRepo.findOne({
      where: opts,
    });
    return exist;
  }
  
  //!Admin Create Topic (MultiLanguage):
  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const { key, description, name, lang, enabled } = createTopicDto;
    // Check if the name topic is exist first.
    const existTopic = await this.findOneTransWith({ name })
    
    const topicLocalize = await this.translateService.t('main.entity.topic'); //TranslateService i18n main.json
    
    if (existTopic) throw new ConflictExc(topicLocalize);

    const newTopic = this.topicRepository.create(createTopicDto);

    newTopic.slug = this.slugify(key); //!Slug

    const newTopicTranslate = this.topicTransRepo.create(createTopicDto);

    newTopic.translates = [newTopicTranslate];
    return this.topicRepository.save(newTopic);
    
  }

  // //!Admin Get All Topic + Pagination (Normal):
  // getAllPaginate(options: IPaginationOptions): Observable<Pagination<TopicInterface>> {
   
  //   const queryBuilder = this.topicRepository.createQueryBuilder('topic');
  //   // queryBuilder.orderBy('topic.createdAt', 'DESC'); //todo: New to Old
  //   queryBuilder.orderBy('topic.key', 'ASC');

  //   return from (paginate<TopicInterface>(queryBuilder, options));
  // }

  // //!Admin SearchFilter + Pagination: (Tìm kiếm + Phân trang) (Normal)
  // searchFilterPaginate(options: IPaginationOptions, topic: TopicInterface): Observable<Pagination<TopicInterface>>{
  //   return from(this.topicRepository.findAndCount({
  //       skip: Number(options.page) * Number(options.limit) || 0, //!page * limit = offset
  //       take: Number(options.limit) || 10,
  //       order: {key: "ASC"},
  //       // relations: ['author', 'taskToCategories'],
  //       select: ['key', 'slug', 'description'], //add more from interface
  //       where: [
  //           { slug: Like(`%${topic.slug}%`)}
  //       ]
  //   })).pipe(
  //       map(([topics, totalTopics]) => {
  //           const topicsPageable: Pagination<TopicInterface> = {
  //               items: topics,
                
  //               links: {
  //                   first: options.route + `?slug=${topic.slug}&page=${Number(options.page = 0)}&limit=${options.limit}`,
  //                   last: options.route + `?slug=${topic.slug}&page=${Math.ceil(totalTopics / Number(options.limit)) -1}&limit=${options.limit}`
  //               },

  //               meta: {
  //                   currentPage: Number(options.page),
  //                   itemCount: topics.length,
  //                   itemsPerPage: Number(options.limit),
  //                   totalItems: totalTopics,
  //                   totalPages: Math.ceil(totalTopics / Number(options.limit))
  //               }
  //           };              
  //           return topicsPageable;
  //       })
  //     ) 
  // }

  //!Client Get All:
  async findAllByClient(): Promise<Topic[]> {
    const query = this.topicRepository.createQueryBuilder('topic')
    .orderBy("topic.key");
    const allTopics =  await query.getMany();
    return allTopics;
  }

  //!Admin Get One (Normal) (Slug):
  // async findOneByAdminKeySlug(slug: any): Promise<Topic> {
  //   const topic = await this.topicRepository.findOne(slug);

  //   if (!topic) {
  //     throw new NotFoundException(`Topic not found !`);
  //   } else {
  //     return topic;
  //   }
  // }

  //!Admin Get One (Multi Language) (id - Slug):
  async findOneMultiLanguageTopic(key: string, params: FindTopicDto) {
    const { lang, enabled } = params;
    const exist = await this.topicRepository
      .createQueryBuilder('topic')
      .innerJoinAndSelect(
        'topic.translates',
        'translate',
        lang && 'translate.lang = :lang',
        {
          lang,
        },
      )
      .where({
        key,
        ...(enabled && { enabled }),
      })
      .getOne();

    // i18n main.json here:
    const topicLocalize = await this.translateService.t('main.entity.topic'); //main.json
    if (!exist) throw new NotFoundExc(topicLocalize);

    // if (!exist) throw new NotFoundException()
    return exist;
  }

  // //!Admin Update One (Normal) (Slug):
  // async updateByAdmin(slug: string, updateTopicDto: UpdateTopicDto): Promise<Topic> { //todo: tieeps tuc lam
  //   const topicToUpdate = await this.topicRepository.findOne({slug: slug});
  //   if (!topicToUpdate) {
  //     throw new NotFoundException(`Topic not found !`);
  //   } else {
  //     const { description, topicTranslate } = updateTopicDto; //relation
  //     // if (key) { //!Cant update key because is is Primary Key
  //     //   topicToUpdate.key = key;
  //     //   topicToUpdate.slug = this.slugify(updateTopicDto.key);
  //     // }
  //     if (description != undefined || description) { topicToUpdate.description = description }
  //     return this.topicRepository.save(topicToUpdate)
  //   }
  // }

  //!Admin Update One (MultiLanguage) (id - key):
  async updateTopicMultiLanguage(key: string, updateTopicDto: UpdateTopicDto){
    const { description, name, lang } = updateTopicDto;
    const existTopic = await this.topicRepository.findOne(key)
    //existTrans -> update, !existTrans -> add new:
    const existTranslate = await this.findOneTransWith({topicKey: key, lang})
    try {
      //update key + description of Topic:
      if (updateTopicDto.key) {existTopic.key = updateTopicDto.key}
      existTopic.slug = this.slugify(existTopic.key); //!Slug
      if (updateTopicDto.description) {existTopic.description = updateTopicDto.description}
      await this.topicRepository.save(existTopic)
      const payloadTopicTranslate: DeepPartial<TopicTranslation> = {
        ...(existTranslate && {id: existTranslate.id}),
        topicKey: existTopic.key,
        ...updateTopicDto,
      };
      await this.topicTransRepo.save(payloadTopicTranslate);
      return this.findOneMultiLanguageTopic(existTopic.key, {lang})
    } catch (err) {
        throw new BadRequestException(
          'Lang not found or Duplicate Name Translate or Key not found',
        );
    }
  }


  // //!Admin Remove One:
  // async removeByAdmin(slug: string): Promise<DeleteResult> {
  //   const topicToDelete = await this.topicRepository.findOne({slug: slug});

  //   if (!topicToDelete) {
  //     throw new NotFoundException(`Topic not found !`);
  //   } else {
  //     return await this.topicRepository.delete({ slug: slug});
  //   }
  // }


  // //!Admin Remove Multi:
  // async removeMulti(slugs: string[]){
  //   const topics = await this.topicRepository.find({
  //     slug: In(slugs)
  //   })

  //   topics.filter(topic => !slugs.includes(topic.slug))

  //   const { affected } = await this.topicRepository.delete({slug: In(slugs)})

	// 	if (affected === 0) {
  //     throw new BadRequestException('Product Multi not found')
  //   }
    
  // }



  //!Admin GetAll Topics + Search + Pagination (MultiLanguage):
  getAllPaginate(options: IPaginationOptions, params: FindManyTopicDto): Observable<Pagination<TopicInterface>> {
    const { lang, enabled, slug } = params; //todo: language

    const queryBuilder = this.topicRepository.createQueryBuilder('topic');
    // queryBuilder.orderBy('topic.createdAt', 'DESC'); //todo: New to Old
    queryBuilder
      .orderBy('topic.key', 'ASC')
      .innerJoinAndSelect( //todo: language
        'topic.translates',
        'translate',
        lang && 'translate.lang = :lang',
        {
          lang,
        },
      )
      .where({
        ...(enabled && { enabled }),
      })
      .where((queryBuilder) => {
        if (slug) queryBuilder.andWhere('topic.slug LIKE :slug', { slug: `%${slug}%` });
      })
  
    return from (paginate<TopicInterface>(queryBuilder, options));
  }


}







###### Topic Controller:
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ParseArrayPipe, ParseIntPipe, Put, Query, Req } from '@nestjs/common';
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, NotFoundException } from '@nestjs/common';

import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { LangEnum } from '../../common/constants/global.constant';
import { GetLangDecor } from '../../common/decorators/lang-header.decorator';
import { EnumValidationPipe } from '../../common/pipes/enum-validation.pipe';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { DeleteTopicMultiDto } from '../dto/delete-topic.dto';
import { FindTopicDto } from '../dto/find-topic.dto';
import { UpdateTopicDto } from '../dto/update-topic.dto';
import { Topic } from '../entities/topic.entity';
import { TopicInterface } from '../entities/topic.interface';
import { TopicService } from '../topic.service';


@Controller('admin/topics')
export class TopicByAdminController {
  constructor(
    private readonly topicService: TopicService
  ) {}

 
  //!Admin Create Topic (Normal):
  // @Post()
  // @UsePipes(ValidationPipe)
  // async create(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
  //   return this.topicService.createByAdmin(createTopicDto);
  // }

  //!Admin Create Topic (MultiLanguage):
  @Post()
  // @UsePipes(ValidationPipe)
  async create(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicService.create(createTopicDto)
  }


  // //!Admin Get All Topics + SearchFilterByKeySlug + Pagination (Normal) (Slug):
  // @Get()
  // index(
  //   @Query('page') page: number = 1, //page * limit = offset
  //   @Query('limit') limit: number = 4,
  //   @Query('slug') slug: string
  // ): Observable<Pagination<TopicInterface>> {
  //     limit = limit > 100 ? 100 : limit;
  //     if (slug === null || slug === undefined) {
      
  //       return this.topicService.getAllPaginate(
  //         {
  //           page: Number(page), 
  //           limit: Number(limit), 
  //           route: 'http://localhost:5000/admin/topics',  
  //         },
          
  //       );
  //   } else if (slug) {
  //       return this.topicService.searchFilterPaginate(
  //           {
  //             page: Number(page),
  //             limit: Number(limit),
  //             route: 'http://localhost:5000/admin/topics',
  //           },
  //           { slug }
  //       );
  //   }
  // }


 //!(Done) Admin GetAll Topics + SearchFilterByKeySlug + Pagination (Multilanguage) (Slug):
  @Get()
  index(
    @Query('page') page: number = 1, //page * limit = offset
    @Query('limit') limit: number = 4,
    @Query('slug') slug: string,
    @Query() params: FindTopicDto, //language
    @GetLangDecor(new EnumValidationPipe(LangEnum)) lang: LangEnum,
  ): Observable<Pagination<TopicInterface>> {
      limit = limit > 100 ? 100 : limit;

      if (slug === null || slug === undefined) {
        if (!params.lang) {
          params.lang = LangEnum.En;
          return this.topicService.getAllPaginate(
            {
              page: Number(page), 
              limit: Number(limit), 
              route: 'http://localhost:5000/admin/topics',  
            },
            
            params //todo: language
          );
        }
        else if(params.lang){
          return this.topicService.getAllPaginate(
            {
              page: Number(page), 
              limit: Number(limit), 
              route: `http://localhost:5000/admin/topics?lang=${params.lang}`,  
            },
            
            params //todo: language
          );
        }
        
    } else if (slug) {
       if (!params.lang) {
          params.lang = LangEnum.En;
          return this.topicService.getAllPaginate(
            {
              page: Number(page), 
              limit: Number(limit), 
              route: `http://localhost:5000/admin/topics?slug=${slug}`,  
            },
            
            params //todo: language
          );
        }
        else if(params.lang){
          return this.topicService.getAllPaginate(
            {
              page: Number(page), 
              limit: Number(limit), 
              route: `http://localhost:5000/admin/topics?lang=${params.lang}&slug=${slug}`,  
            },
            
            params //todo: language
          );
        }
    }
  }

  // //!Admin Get One (Normal) (Slug):
  // @Get(':slug')
  // async findOne(@Param('slug') slug): Promise<Topic> {
  //   return await this.topicService.findOneByAdminKeySlug({slug});
  // }

  // //!Admin Get One (MultiLanguage) (id - key):
  // @Get(':id')
  // findOneMultiLanguageTopic(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Query() params: FindTopicDto,
  //   @GetLangDecor(new EnumValidationPipe(LangEnum)) lang: LangEnum,
  // ) {
  //   if (!params.lang) params.lang = lang;
  //   return this.topicService.findOneMultiLanguageTopic(id, params)
  // }

  //!Admin Get One (MultiLanguage) (slug):
  @Get(':slug')
  findOneMultiLanguageTopic(
    @Param('slug') slug,
    @Query() params: FindTopicDto,
    @GetLangDecor(new EnumValidationPipe(LangEnum)) lang: LangEnum,
  ) {
    if (!params.lang) params.lang = lang;
    return this.topicService.findOneMultiLanguageTopic(slug, params)
  }

  // //!Admin Update One (Normal) (Slug):
  // @Patch(':slug')
  // async update(@Param() param, @Body() updateTopicDto: UpdateTopicDto) {
  //   return this.topicService.updateByAdmin(param.slug, updateTopicDto);
  // }

  //!Admin Update One (MultiLanguage) (id - key):
  @Put(':key')
  async updateTopicMultiLanguage(
    @Param('key') key: string, 
    @Body() updateTopicDto: UpdateTopicDto
  ) {
    return this.topicService.updateTopicMultiLanguage(key, updateTopicDto);
  }


  // //!Delete (Normal):
  // @Delete(':slug')
  // remove(@Param() param ) {
  //   return this.topicService.removeByAdmin(param.slug);
  // }

  // @Delete()
  // removeMulti(
  //   @Query('slugs', ParseArrayPipe) slugs: string[]
  // ){
  //   return this.topicService.removeMulti(slugs)
  // }
}



