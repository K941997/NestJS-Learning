###### i18n chỉ thay đổi multilanguage hệ thống
###### Muốn multilanguage như 1 Dictionary thì phải CRUD Topic relation TopicTranslate lưu vào Database

###### Topic.Service:
# Bản 1:
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, In, IsNull, Like, Not, Repository } from 'typeorm';
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
import { FindManyTopicDto, FindTopicDto } from './dto/find-topic.dto';

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

  //!(Done) Admin Create Topic (MultiLanguage):
  async findOneTransWith(opts: FindConditions<TopicTranslation>) {
    const exist = await this.topicTransRepo.findOne({
      where: opts,
    });
    return exist;
  }
  
  //!(Done) Admin Create Topic (MultiLanguage):
  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const { key, description, name, lang, enabled } = createTopicDto;
    // Check if the name topic is exist first.
    const existTranslate = await this.findOneTransWith({ name })
    const topicLocalize = await this.translateService.t('main.entity.topic'); //TranslateService i18n main.json
    if (existTranslate) throw new ConflictExc("Duplicate " + topicLocalize + " already exists");

    const newTopic = this.topicRepository.create(createTopicDto);
    newTopic.slug = this.slugify(key); //!Slug

    const newTopicTranslate = this.topicTransRepo.create(createTopicDto);
    newTopic.translates = [newTopicTranslate];
    return this.topicRepository.save(newTopic);
    
  }

  //!(Done) Admin GetAll Topics + Search + Pagination (MultiLanguage) (slug or key):
  getAllSearchPaginate(options: IPaginationOptions, params: FindManyTopicDto): Observable<Pagination<TopicInterface>> {
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


  //!(Done) Client GetAll:
  async getAllByClient(): Promise<Topic[]> {
    const query = this.topicRepository.createQueryBuilder('topic')
    .orderBy("topic.key");
    const allTopics =  await query.getMany();
    return allTopics;
  }

  //!(Done) Admin GetOne (MultiLanguage):
  async findOneTopic(key: string, params: FindTopicDto) {
    const { lang, enabled } = params;
    const existTopic = await this.topicRepository
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
    const topicLocalize = await this.translateService.t('main.entity.topic');
    if (!existTopic) throw new NotFoundExc(topicLocalize);
    return existTopic;
  }


  //!(Done) Admin UpdateOne (MultiLanguage):
  async updateOneTopic(key: string, updateTopicDto: UpdateTopicDto){
    const { description, name, lang } = updateTopicDto;

    const existTopic = await this.topicRepository.findOne(key)
    if (!existTopic) { throw new NotFoundException("Topic not found") }
    const existTranslate = await this.findOneTransWith({topicKey: key, lang})

    try {
      //update description of Topic:
      //cant update key because it's primary key 
      if (updateTopicDto.description) {existTopic.description = updateTopicDto.description}
      await this.topicRepository.save(existTopic)

      //existTrans -> update, !existTrans -> add new:
      const payloadTopicTranslate: DeepPartial<TopicTranslation> = {
        ...(existTranslate && {id: existTranslate.id}),
        topicKey: key,
        ...updateTopicDto,
      };
      
      await this.topicTransRepo.save(payloadTopicTranslate);
      return this.findOneTopic(key, {lang})
    } catch (err) {
        throw new BadRequestException(
          'Lang not found or Duplicate Name Translate',
        );
    }
  }


  //!(Done) Admin RemoveOne (MultiLanguage):
  async removeOneTopic(key: string){
    const topicToDelete = await this.topicRepository.findOne(key);

    if (!topicToDelete) {
      throw new NotFoundException(`Topic not found !`);
    } else {
      return await Promise.all(
        [
          this.topicRepository.softDelete({ key: key, deletedAt: IsNull()}),
          this.topicTransRepo.softDelete({ topicKey: key, deletedAt: IsNull()})
        ]
      ) 
    }
  }


  //!(Done) Admin RemoveMulti (MultiLanguage):
  async removeMultiTopics(keys: string[]){
    const topics = await this.topicRepository.find({
      key: In(keys)
    })
    topics.filter(topic => !keys.includes(topic.key))

    const [result] =  await Promise.all(
      [
        this.topicRepository.softDelete({key: In(keys), deletedAt: IsNull()}),
        this.topicTransRepo.softDelete({topicKey: In(keys), deletedAt: IsNull()})
      ]
    )
    
    const localize = await this.translateService.t('main.entity.topic');
    if (!result.affected) throw new NotFoundExc(localize);
    return result;
  }


}

# Bản cuối:
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, In, IsNull, Like, Not, Repository } from 'typeorm';
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
import { FindManyTopicDto, FindTopicDto } from './dto/find-topic.dto';

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

  async findOneTransWith(opts: FindConditions<TopicTranslation>) {
    const exist = await this.topicTransRepo.findOne({
      where: opts,
    });
    return exist;
  }
  
  //!(Done) Admin Create Topic (MultiLanguage):
  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const { key, description, name, lang, enabled } = createTopicDto;
    // Check if the name topic is exist first.
    const existTranslate = await this.findOneTransWith({ name })
    const topicLocalize = await this.translateService.t('main.entity.topic'); //i18n
    if (existTranslate) throw new ConflictExc("Duplicate " + topicLocalize + " already exists");

    const newTopic = this.topicRepository.create(createTopicDto);
    newTopic.slug = this.slugify(key); //slug

    const newTopicTranslate = this.topicTransRepo.create(createTopicDto);
    newTopic.translates = [newTopicTranslate];
    return this.topicRepository.save(newTopic);
    
  }

  //!(Done) Admin GetAll Topics + Search + Pagination (MultiLanguage) (slug):
  getAllByAdmin(options: IPaginationOptions, params: FindManyTopicDto): Observable<Pagination<TopicInterface>> {
    const { lang, enabled, slug } = params;
    const opts: FindConditions<Topic> = {
      ...(enabled && { enabled }),
    };
    const queryBuilder = this.topicRepository.createQueryBuilder('topic');
    queryBuilder
      .orderBy('topic.key', 'ASC')
      .innerJoinAndSelect(
        'topic.translates',
        'translate',
        lang && 'translate.lang = :lang',
        {
          lang,
        },
      )
      .where((queryBuilder) => {
        queryBuilder.where(opts)
        if (slug) queryBuilder.andWhere('topic.slug LIKE :slug', { slug: `%${slug}%` });
      })

    return from (paginate<TopicInterface>(queryBuilder, options));
  }

  //!(Not Done) Client GetAll Not Paginate:
  getAllByClientNotPaginate(params: FindManyTopicDto): Observable<TopicInterface[]> {
    const {lang, enabled} = params;
    const opts: FindConditions<Topic> = {
      ...(enabled && { enabled }),
    };
    const queryBuilder = this.topicRepository.createQueryBuilder('topic')
      .orderBy("topic.key", 'ASC')
      .innerJoinAndSelect( //todo: language
        'topic.translates',
        'translate',
        lang && 'translate.lang = :lang',
        {
          lang,
        },
      )
      .where(opts)
      .getMany(); //topicInterface[]

    return from (queryBuilder);
  }

  //!(Not Done) Client GetAll Paginate:
  getAllByClientPaginate(options: IPaginationOptions, params: FindManyTopicDto): Observable<Pagination<TopicInterface>>{
    const { lang, enabled } = params;
    const opts: FindConditions<Topic> = {
      ...(enabled && { enabled }),
    };
    const queryBuilder = this.topicRepository.createQueryBuilder('topic');
      queryBuilder
      .orderBy('topic.key', 'ASC')
      .innerJoinAndSelect(
        'topic.translates',
        'translate',
        lang && 'translate.lang = :lang',
        {
          lang,
        },
      )
      .where(opts)

    return from (paginate<TopicInterface>(queryBuilder, options));
  }

  //!(Done) Admin GetOne (MultiLanguage):
  async findOneTopic(key: string, params: FindTopicDto) {
    const { lang, enabled } = params;
    const existTopic = await this.topicRepository
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
    const topicLocalize = await this.translateService.t('main.entity.topic');
    if (!existTopic) throw new NotFoundExc(topicLocalize);
    return existTopic;
  }

  //!(Done) Admin UpdateOne (MultiLanguage):
  async updateOneTopic(key: string, updateTopicDto: UpdateTopicDto){
    const { description, name, lang, enabled } = updateTopicDto;

    const existTopic = await this.topicRepository.findOne(key)
    if (!existTopic) { throw new NotFoundException("Topic not found") }

    const existTranslate = await this.findOneTransWith({topicKey: key, lang})
    try {
      //update description of Topic:
      //cant update key because it's primary key 
      if (description != undefined || description) {existTopic.description = description}
      if (enabled) {existTopic.enabled = enabled}
      await this.topicRepository.save(existTopic)

      //existTrans -> update, !existTrans -> add new:
      const payloadTopicTranslate: DeepPartial<TopicTranslation> = {
        ...(existTranslate && {id: existTranslate.id}),
        topicKey: key,
        ...updateTopicDto,
      };
      
      await this.topicTransRepo.save(payloadTopicTranslate);
      return this.findOneTopic(key, {lang})
    } catch (err) {
        throw new BadRequestException(
          'Wrong Input',
        );
    }
  }


  //!(Done) Admin RemoveOne (MultiLanguage):
  async removeOneTopic(key: string){
    const topicToDelete = await this.topicRepository.findOne(key);
    if (!topicToDelete) {
      throw new NotFoundException(`Topic not found !`);
    } else {
      return await Promise.all(
        [
          this.topicRepository.softDelete({ key: key, deletedAt: IsNull()}),
          this.topicTransRepo.softDelete({ topicKey: key, deletedAt: IsNull()})
        ]
      ) 
    }
  }

  //!(Done) Admin RemoveMulti (MultiLanguage):
  async removeMultiTopics(keys: string[]){
    const topics = await this.topicRepository.find({
      key: In(keys)
    })
    topics.filter(topic => !keys.includes(topic.key))

    const [result] =  await Promise.all(
      [
        this.topicRepository.softDelete({key: In(keys), deletedAt: IsNull()}),
        this.topicTransRepo.softDelete({topicKey: In(keys), deletedAt: IsNull()})
      ]
    )
    
    const localize = await this.translateService.t('main.entity.topic'); //i18n
    if (!result.affected) throw new NotFoundExc(localize);
    return result;
  }


}




###### Topic-admin.controller:
# Chỉ phía Client mới cần SEO nhập Router -> Admin ko cần -> ko hiển page, limit, router khi GetAllTopicsPagination
# Bản 1:
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
import { FindManyTopicDto, FindTopicDto } from '../dto/find-topic.dto';
import { UpdateTopicDto } from '../dto/update-topic.dto';
import { Topic } from '../entities/topic.entity';
import { TopicInterface } from '../entities/topic.interface';
import { TopicService } from '../topic.service';


@Controller('admin/topics')
export class TopicByAdminController {
  constructor(
    private readonly topicService: TopicService
  ) {}


  //!(Done) Admin Create Topic (MultiLanguage):
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicService.create(createTopicDto)
  }


  //!(Done) Admin GetAll Topics + SearchFilterByKeySlug + Pagination (Multilanguage) (slug or key):
  @Get()
  getAllSearchPaginate(
    @Query('page') page: number = 1, //page * limit = offset
    @Query('limit') limit: number = 10,
    @Query('slug') slug: string,
    @Query() params: FindManyTopicDto, //language, enabled, 
  ): Observable<Pagination<TopicInterface>> {
      limit = limit > 100 ? 100 : limit;
      if (slug === null || slug === undefined) {
        if (!params.lang) {
          params.lang = LangEnum.En;
          return this.topicService.getAllSearchPaginate(
            // {
            //   page: Number(page), 
            //   limit: Number(limit), 
            //   route: 'http://localhost:5000/admin/topics',  
            // },
            // params //todo: language
            {page, limit},
            params
          );
        }
        else if(params.lang){
          return this.topicService.getAllSearchPaginate(
            // {
            //   page: Number(page), 
            //   limit: Number(limit), 
            //   route: `http://localhost:5000/admin/topics?lang=${params.lang}`,  
            // },  
            // params //todo: language
            {page, limit},
            params
          );
        }
      } else if (slug) {
        if (!params.lang) {
          params.lang = LangEnum.En;
          return this.topicService.getAllSearchPaginate(
            // {
            //   page: Number(page), 
            //   limit: Number(limit), 
            //   route: `http://localhost:5000/admin/topics?slug=${slug}`,  
            // },
            // params //todo: language
            {page, limit},
            params
          );
        } else if(params.lang){
          return this.topicService.getAllSearchPaginate(
              // {
              //   page: Number(page), 
              //   limit: Number(limit), 
              //   route: `http://localhost:5000/admin/topics?lang=${params.lang}&slug=${slug}`,  
              // },
              // params //todo: language
              {page, limit},
              params
          );
        }
      }
  }

  //!(Done) Admin GetOne (MultiLanguage):
  @Get(':key')
  @UsePipes(ValidationPipe)
  findOneTopic(
    @Param('key') key: string,
    @Query() params: FindTopicDto,
    @GetLangDecor(new EnumValidationPipe(LangEnum)) lang: LangEnum,
  ) {
    if (!params.lang) params.lang = lang;
    return this.topicService.findOneTopic(key, params)
  }

  //!(Done) Admin UpdateOne (MultiLanguage):
  @Put(':key')
  @UsePipes(ValidationPipe)
  async updateOneTopic(
    @Param('key') key: string, 
    @Body() updateTopicDto: UpdateTopicDto
  ) {
    return this.topicService.updateOneTopic(key, updateTopicDto);
  }



  //!(Done) Admin RemoveOne (MultiLanguage):
  @Delete(':key')
  removeOneTopic(@Param() param ) {
    return this.topicService.removeOneTopic(param.key);
  }

  //!(Done) Admin RemoveMulti (MultiLanguage):
  @Delete()
  removeMulti(
    @Query('keys', ParseArrayPipe) keys: string[]
  ){
    return this.topicService.removeMultiTopics(keys)
  }
}

############################## Bản cuối:
###### topic.service.ts:
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  In,
  IsNull,
  Like,
  Not,
  Repository,
} from 'typeorm';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { TopicTranslation } from './entities/topic-translation.entity';
import { FindConditions } from 'typeorm';
import { TranslateService } from '../utils-module/services/translate.service';
import {
  ConflictExc,
  NotFoundExc,
} from '../common/exceptions/custom.exception';
import { FindManyTopicDto, FindTopicDto } from './dto/find-topic.dto';

import slug from 'slug';
import { LangEnum } from '../common/constants/global.constant';
import { TopicTranslationRepository } from './repositories/topic-translation.repository';
import { TopicRepository } from './repositories/topic.repository';

@Injectable()
export class TopicService {
  constructor(
    private topicTransRepo: TopicTranslationRepository,
    private topicRepository: TopicRepository,
    private translateService: TranslateService,
  ) {}

  slugify(key: string) {
    return slug(key, { lower: true }).toString();
  }

  async findOneTransWith(opts: FindConditions<TopicTranslation>) {
    const exist = await this.topicTransRepo.findOne({
      where: opts,
    });
    return exist;
  }

  //Admin CREATE Topic (MultiLanguage):
  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const { key, description, name, lang, enabled } = createTopicDto;
    //check existTrans of any Topic:
    const existTranslate = await this.findOneTransWith({ name });
    const topicLocalize = await this.translateService.t('main.entity.topic'); //i18n
    if (existTranslate) throw new ConflictExc(topicLocalize);
    //check existTopic:
    const existTopic = await this.topicRepository.findOne({ key: key });
    if (existTopic) throw new ConflictExc(topicLocalize);
    //create Topic:
    const newTopic = this.topicRepository.create(createTopicDto);
    newTopic.slug = this.slugify(key); //slug
    //create trans for Topic:
    const newTopicTranslate = this.topicTransRepo.create(createTopicDto);
    newTopic.translates = [newTopicTranslate];
    return this.topicRepository.save(newTopic);
  }

  //Admin GETALL Topics + Search(slug) + Pagination (MultiLanguage):
  async findAllByAdmin(
    options: IPaginationOptions,
    params: FindManyTopicDto,
  ): Promise<Pagination<Topic>> {
    const { lang, enabled, slug } = params;
    const opts: FindConditions<Topic> = {
      ...(enabled && { enabled }),
    };
    const queryBuilder = this.topicRepository.createQueryBuilder('topic');
    queryBuilder
      .innerJoinAndSelect(
        'topic.translates',
        'topicTranslation',
        lang && 'topicTranslation.lang = :lang',
        {
          lang,
        },
      )
      .where((queryBuilder) => {
        queryBuilder.where(opts);
        if (slug)
          queryBuilder.andWhere('topic.slug LIKE :slug', { slug: `%${slug}%` });
      })
      .orderBy('topic.key', 'ASC');

    return paginate<Topic>(queryBuilder, options);
  }

  //Admin GETONE Topic (MultiLanguage):
  async findOne(key: string, params: FindTopicDto) {
    const { lang, enabled } = params;
    const existTopic = await this.topicRepository
      .createQueryBuilder('topic')
      .innerJoinAndSelect(
        'topic.translates',
        'topicTranslation',
        lang && 'topicTranslation.lang = :lang',
        {
          lang,
        },
      )
      .where({
        key,
        ...(enabled && { enabled }),
      })
      .getOne();

    // i18n:
    const topicLocalize = await this.translateService.t('main.entity.topic');
    if (!existTopic) throw new NotFoundExc('Not Found ' + topicLocalize);
    return existTopic;
  }

  //Admin UPDATEONE Topic (MultiLanguage):
  async update(key: string, updateTopicDto: UpdateTopicDto) {
    const { description, name, lang, enabled } = updateTopicDto;

    //check existTopic:
    const existTopic = await this.topicRepository.findOne({ key: key });
    if (!existTopic) {
      throw new NotFoundException('Topic not found');
    }

    //check existTrans:
    const existTrans = await this.findOneTransWith({
      topicKey: key,
      lang,
    });

    //check existTransName of other Level:
    const existTransName = await this.findOneTransWith({
      topicKey: Not(key),
      name,
    });
    const topicLocal = await this.translateService.t('main.entity.topic'); //i18n
    if (existTransName)
      throw new ConflictException('Duplicate TransName ' + topicLocal);

    //update Topic:
    //cant update key because it's primary key
    if (description) {
      existTopic.description = description;
    }
    if (enabled) {
      existTopic.enabled = enabled;
    }
    await this.topicRepository.save(existTopic);

    //update Trans
    //existTrans -> update, !existTrans -> add new:
    const payloadTopicTranslate: DeepPartial<TopicTranslation> = {
      ...(existTrans && { id: existTrans.id }),
      topicKey: key,
      ...updateTopicDto,
    };

    await this.topicTransRepo.save(payloadTopicTranslate);
    return this.findOne(key, { lang: lang });
  }

  //Admin REMOVEONE Topic (MultiLanguage):
  async remove(key: string) {
    const topicToDelete = await this.topicRepository.findOne(key);
    if (!topicToDelete) {
      throw new NotFoundException(`Topic not found !`);
    }
    return await Promise.all([
      this.topicRepository.softDelete({ key: key, deletedAt: IsNull() }),
      this.topicTransRepo.softDelete({ topicKey: key, deletedAt: IsNull() }),
    ]);
  }

  //Admin REMOVEMULTI Topics (MultiLanguage):
  async removeMulti(keys: string[]) {
    const [result] = await Promise.all([
      this.topicRepository.softDelete({ key: In(keys), deletedAt: IsNull() }),
      this.topicTransRepo.softDelete({
        topicKey: In(keys),
        deletedAt: IsNull(),
      }),
    ]);

    const localize = await this.translateService.t('main.entity.topic'); //i18n
    if (!result.affected) throw new NotFoundExc(localize);
    return result;
  }

  //Client GETALL Topics + No Pagination (MultiLanguage):
  async findAllByClientNoPagination(
    params: FindManyTopicDto,
  ): Promise<Topic[]> {
    const { lang, enabled } = params;
    const opts: FindConditions<Topic> = {
      ...(enabled && { enabled }),
    };
    const queryBuilder = this.topicRepository
      .createQueryBuilder('topic')
      .innerJoinAndSelect(
        'topic.translates',
        'topicTranslation',
        lang && 'topicTranslation.lang = :lang',
        {
          lang,
        },
      )
      .where(opts)
      .orderBy('topic.key', 'ASC')
      .getMany();

    return queryBuilder;
  }

  //Client GETALL Topics + Pagination (MultiLanguage):
  async findAllByClientPagination(
    options: IPaginationOptions,
    params: FindManyTopicDto,
  ): Promise<Pagination<Topic>> {
    const { lang, enabled } = params;
    const opts: FindConditions<Topic> = {
      ...(enabled && { enabled }),
    };
    const queryBuilder = this.topicRepository.createQueryBuilder('topic');
    queryBuilder
      .innerJoinAndSelect(
        'topic.translates',
        'topicTranslation',
        lang && 'topicTranslation.lang = :lang',
        {
          lang,
        },
      )
      .where(opts)
      .orderBy('topic.key', 'ASC');

    return paginate<Topic>(queryBuilder, options);
  }
}

###### topic-admin.controller.ts:
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ParseArrayPipe, ParseIntPipe, Put, Query, Req } from '@nestjs/common';
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, NotFoundException } from '@nestjs/common';

import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { BooleanEnum, LangEnum } from '../../common/constants/global.constant';
import { GetLangDecor } from '../../common/decorators/lang-header.decorator';
import { EnumValidationPipe } from '../../common/pipes/enum-validation.pipe';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { DeleteTopicMultiDto } from '../dto/delete-topic.dto';
import { FindManyTopicDto, FindTopicDto } from '../dto/find-topic.dto';
import { UpdateTopicDto } from '../dto/update-topic.dto';
import { Topic } from '../entities/topic.entity';
import { TopicInterface } from '../entities/topic.interface';
import { TopicService } from '../topic.service';


@Controller('admin/topics')
export class TopicByAdminController {
  constructor(
    private readonly topicService: TopicService
  ) {}

  //!(Done) Admin Create Topic (MultiLanguage):
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createTopicDto: CreateTopicDto): Promise<Topic> {
    return this.topicService.create(createTopicDto)
  }

  //!(Done) Admin GetAll Topics + SearchFilterByKeySlug + Pagination (Multilanguage) (slug or key):
  @Get()
  getAllSearchPaginate(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() params: FindManyTopicDto, //language, enabled, slug
  ): Observable<Pagination<TopicInterface>> {
    limit = limit > 100 ? 100 : limit;
    if (!params.lang) { params.lang = LangEnum.En }
    else if (page < 1) { throw new NotFoundException("Page Not Found") }
    // if (!params.enabled) { params.enabled = BooleanEnum.TRUE }
    return this.topicService.getAllByAdmin({page, limit}, params);
  }

  //!(Done) Admin GetOne (MultiLanguage):
  @Get(':key')
  findOneTopic(
    @Param('key') key: string,
    @Query() params: FindTopicDto,
  ) {
    if (!params.lang) { params.lang = LangEnum.En }

    return this.topicService.findOneTopic(key, params)
  }

  //!(Done) Admin UpdateOne (MultiLanguage):
  @Put(':key')
  @UsePipes(ValidationPipe)
  async updateOneTopic(
    @Param('key') key: string, 
    @Body() updateTopicDto: UpdateTopicDto
  ) {
    return this.topicService.updateOneTopic(key, updateTopicDto);
  }

  //!(Done) Admin RemoveOne (MultiLanguage):
  @Delete(':key')
  removeOneTopic(@Param() param ) {
    return this.topicService.removeOneTopic(param.key);
  }

  //!(Done) Admin RemoveMulti (MultiLanguage):
  @Delete()
  removeMulti(
    @Query('keys', ParseArrayPipe) keys: string[]
  ){
    return this.topicService.removeMultiTopics(keys)
  }
}


###### topic-client.controller.ts:
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Query, NotFoundException } from '@nestjs/common';
import { BooleanEnum, LangEnum } from '../../common/constants/global.constant';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { FindManyTopicDto, FindTopicDto } from '../dto/find-topic.dto';
import { UpdateTopicDto } from '../dto/update-topic.dto';
import { Topic } from '../entities/topic.entity';
import { TopicService } from '../topic.service';


@Controller('client/topics')
export class TopicByClientController {
  constructor(
    private readonly topicService: TopicService
  ) {}

  @Get()
  findAllClient(
    @Query() params: FindManyTopicDto, //language, enabled, slug
    @Query('page') page: number,
    @Query('limit') limit = 10,
  ){
    limit = limit > 100 ? 100 : limit;
    params.enabled = BooleanEnum.TRUE;
    if (!params.lang) { params.lang = LangEnum.En }
    
    if (!page) return this.topicService.getAllByClientNotPaginate(params)
    else if (page < 1) { throw new NotFoundException("Page Not Found") }
    return this.topicService.getAllByClientPaginate(
      {
        page: Number(page), 
        limit: Number(limit), 
        route: `http://localhost:${process.env.PORT}/client/topics`,  
      },
      params
    )

  }
}









