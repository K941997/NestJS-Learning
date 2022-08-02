########################### CRUD Level (MultiLanguage) ###########################
###### Entity:
# level.entity.ts:
import { BooleanEnum } from '../../common/constants/global.constant';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LevelTranslation } from './level-translation.entity';
import { BaseEntity } from '../../common/entities/base.entity'; //version, createAt, updateAt, deleteAt

@Entity()
export class Level extends BaseEntity {
  // @PrimaryGeneratedColumn()
  // id: number;

  @PrimaryColumn()
  key: string;

  @Column({
    nullable: true,
  })
  slug: string;

  @Column({
    nullable: true,
  })
  description: string;

  @OneToMany(
    () => LevelTranslation,
    (levelTranslate: LevelTranslation) => levelTranslate.level,
    {
      cascade: ['insert'],
    },
  )
  translates: LevelTranslation[];

  // Join videos
  @OneToOne(() => Videos, (video) => video.level, { cascade: ['insert'] })
  video: Videos;
  // End join videos

  // Join user
  @OneToMany(() => User, (user) => user.level, { cascade: ['insert'] })
  user: User[];
  // End join user

  // Join audios
  @OneToOne(() => Audio, (audio) => audio.level, { cascade: ['insert'] })
  audio: Audio;
  // End join audios
}

# level-translation.entity.ts:
import {
  NameConstraintEntity,
  LangEnum,
} from '../../common/constants/global.constant';
import { ColumnString } from '../../common/decorators/custom-column.decorator';
import { BaseEntity } from '../../common/entities/base.entity'; //version, createAt, updateAt, deleteAt
import { getEnumStr } from '../../common/utils';
import {
  Entity,
  Unique,
  Check,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Level } from './level.entity';

@Entity()
@Unique(`${NameConstraintEntity.UQ_LEVEL_TRANSLATE_1}`, ['levelKey', 'lang'])
@Check(
  `${NameConstraintEntity.CHK_LEVEL_TRANSLATE_1}`,
  `"lang" IN (${getEnumStr(LangEnum)})`,
)
export class LevelTranslation extends BaseEntity {
  @PrimaryGeneratedColumn({})
  id: number;

  @ColumnString({ unique: true })
  name: string;

  @ColumnString({ default: LangEnum.En, enum: LangEnum })
  lang: LangEnum;

  @Column({ name: 'level_key' })
  levelKey: string;

  @ManyToOne(() => Level, (level) => level.translates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'level_key', referencedColumnName: 'key' },
    // { name: 'level_id', referencedColumnName: 'id' },
  ])
  level: Level;
}

# level.interface.ts (Khong can) (for pagination Observable):
export interface LevelInterface {
  key?: string;
  slug?: string;
  description?: string;
}

###### Admin CREATE Level (MultiLanguage):
# create-level.dto.ts:
import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';
import { BooleanEnum, LangEnum } from '../../common/constants/global.constant';
import { Default } from '../../common/decorators/default-value.decorator';
import {
  IsValidEnumNumber,
  IsValidEnumString,
  IsValidText,
} from '../../common/decorators/custom-validator.decorator';

export class CreateLevelDto {
  @IsValidText({ minLength: 5, maxLength: 50, required: true })
  key: string;

  @IsValidText({ minLength: 5, maxLength: 255, required: false })
  description: string;

  @IsValidEnumNumber({ enum: BooleanEnum, required: false })
  enabled: BooleanEnum;

  @IsValidText({ minLength: 5, maxLength: 50, required: true })
  name: string;

  @ApiHideProperty()
  @IsValidEnumString({ enum: LangEnum, required: false })
  lang: LangEnum;
}


# level.service.ts:
 slugify(key: string) {
    return slug(key, { lower: true }).toString(36);
  }

  async findOneTransWith(opts: FindConditions<LevelTranslation>) {
    const existTrans = await this.levelTransRepo.findOne({
      where: opts,
    });
    return existTrans;
  }

  //!Admin Create Level (MultiLanguage):
  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const { key, description, name, lang, enabled } = createLevelDto;
    //check existTrans of any Level:
    const existTrans = await this.findOneTransWith({ name });
    const levelLocal = await this.translateService.t('main.entity.level'); //i18n
    if (existTrans) throw new ConflictException('Duplicate ' + levelLocal);
    //check existLevel:
    const existLevel = await this.levelRepo.findOne({ key: key });
    if (existLevel) throw new ConflictException('Duplicate ' + levelLocal);
    //create Level:
    const newLevel = this.levelRepo.create(createLevelDto);
    newLevel.slug = this.slugify(key); //slug
    //create trans for Level:
    const newLevelTrans = this.levelTransRepo.create(createLevelDto);
    newLevel.translates = [newLevelTrans];
    return this.levelRepo.save(newLevel);
  }

# level-admin.controller.ts:
//!Admin Create Level (MultiLanguage):
@Post()
// @UsePipes(ValidationPipe)
async create(@Body() createLevelDto: CreateLevelDto): Promise<Level> {
  return this.levelService.create(createLevelDto);
}

###### Admin GETALL Levels + Search(slug) + Pagination (MultiLanguage):
# find-level.dto.ts:
export class FindManyLevelsDto extends PaginateDto {
  @IsValidText({ required: false })
  slug?: string;

  @IsValidEnumString({ enum: LangEnum, required: false })
  lang?: LangEnum; //lang=en

  @IsValidNumber() //can't use IsValidEnumNumber()
  @IsOptional()
  enabled?: BooleanEnum; //admin: 1 or 0 || client: only 1
}

# level.service.ts:
//!Admin GETALL Levels + Search(slug) + Pagination (MultiLanguage):
async findAllByAdmin(
  options: IPaginationOptions,
  params: FindManyLevelsDto,
): Promise<Pagination<Level>> {
  const { slug, enabled, lang } = params;
  const opts: FindConditions<Level> = {
    ...((enabled && { enabled }) || (enabled == 0 && { enabled })),
  };
  const queryBuilder = this.levelRepo.createQueryBuilder('level');
  queryBuilder
    .orderBy('level.key', 'ASC')
    .innerJoinAndSelect(
      'level.translates',
      'level-translation',
      lang && 'level-translation.lang = :lang',
      {
        lang,
      },
    )
    .where((queryBuilder) => {
      queryBuilder.where(opts);
      if (slug)
        queryBuilder.andWhere('level.slug LIKE :slug', { slug: `%${slug}` });
    });
  return paginate<Level>(queryBuilder, options);
}

# level-admin.controller.ts:
//!Admin GETALL Levels + Search(slug) + Pagination (MultiLanguage):
@Get()
// @UsePipes(ValidationPipe)
async findAllByAdmin(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query() params: FindManyLevelsDto, //language, enabled, slug
): Promise<Pagination<Level>> {
  limit = limit > 100 ? 100 : limit;
  if (!params.lang) {
    params.lang = LangEnum.En;
  }
  // if (!params.enabled) { params.enabled = BooleanEnum.TRUE }
  if (page < 1) {
    throw new NotFoundException('Page Not Found'); //khong can vi da validate pagedto o findmanydto
  }
  return this.levelService.findAllByAdmin({ page, limit }, params);
}

###### Admin GETONE Level (MultiLanguage):
# find-level.dto.ts:
export class FindOneLevelDto {
  @IsValidEnumString({ enum: LangEnum, required: false })
  lang?: LangEnum;

  @IsValidNumber() //can't use IsValidEnumNumber()
  @IsOptional()
  enabled?: BooleanEnum; //admin: 1 or 0 || client: only 1
}

# level.service.ts:
//!Admin GETONE Level (MultiLanguage):
async findOne(key: string, params: FindOneLevelDto) {
  const { enabled, lang } = params;
  const existLevel = await this.levelRepo
    .createQueryBuilder('level')
    .innerJoinAndSelect(
      'level.translates',
      'level-translation',
      lang && 'level-translation.lang = :lang',
      {
        lang,
      },
    )
    .where({
      key,
      ...((enabled && { enabled }) || (enabled == 0 && { enabled })), //enabled == 0 is special
    })
    .getOne();

  const levelLocal = await this.translateService.t('main.entity.level'); //i18n
  if (!existLevel) {
    throw new NotFoundExc('Not Found ' + levelLocal);
  }
  return existLevel;
}

# level-admin.controller.ts:
//!Admin GETONE Level (MultiLanguage):
@Get(':key')
// @UsePipes(ValidationPipe)
findOne(@Param('key') key: string, @Query() params: FindOneLevelDto) {
  if (!params.lang) {
    params.lang = LangEnum.En;
  }
  return this.levelService.findOne(key, params);
}

###### Admin UPDATEONE Level (MultiLanguage):
# update-level.dtop.ts:
export class UpdateLevelDto {
  // key: string; //Cant update key because Primary Key

  @IsValidText({ minLength: 5, maxLength: 255, required: false })
  description: string;

  @IsValidEnumNumber({ enum: BooleanEnum, required: false })
  enabled: BooleanEnum;

  @IsValidText({ minLength: 2, maxLength: 50, required: false })
  name: string;

  @IsValidEnumString({ enum: LangEnum, required: false })
  lang: LangEnum;
}

# level.service.ts:
//Admin UPDATEONE Level (MultiLanguage):
async update(key: string, updateLevelDto: UpdateLevelDto) {
  //cho hết required: true
  const { description, enabled, name, lang } = updateLevelDto;

  //check existLevel:
  const existLevel = await this.levelRepo.findOne({ key });
  if (!existLevel) {
    throw new NotFoundException('Level not found');
  }

  //check existTrans:
  const existTrans = await this.findOneTransWith({
    levelKey: key,
    lang,
  });
  <!-- if (!existTrans) { -> Lỗi ko sửa được bản dịch cũ
    throw new NotFoundException('Trans not found');
  } -->

  //check existTransName of other Level:
  const existTransName = await this.findOneTransWith({
    levelKey: Not(key),
    name,
  });
  const levelLocal = await this.translateService.t('main.entity.level'); //i18n
  if (existTransName)
    throw new ConflictException('Duplicate TransName ' + levelLocal);

  //update Level:
  //cant update key because it's primary key
  if (description) {
    existLevel.description = description;
  }
  if (enabled) {
    existLevel.enabled = enabled;
  }
  await this.levelRepo.save(existLevel);

  //update Trans:
  //existTrans -> update, !existTrans -> add new:
  const payloadLevelTranslate: DeepPartial<LevelTranslation> = {
    ...(existTrans && { id: existTrans.id }), //bỏ đi sẽ ko giữ nguyên bản dịch để cập nhật -> tạo cái mới
    levelKey: key,
    ...updateLevelDto,
  };

  await this.levelTransRepo.save(payloadLevelTranslate);
  return this.findOne(key, { lang: lang });
}

# level-admin.controller.ts:
//!Admin UPDATEONE Level (MultiLanguage):
@Put(':key')
// @UsePipes(ValidationPipe)
async update(
  @Param('key') key: string,
  @Body() updateLevelDto: UpdateLevelDto,
) {
  return this.levelService.update(key, updateLevelDto);
}

###### Admin REMOVEONE Level (MultiLanguage):
# level.service.ts:
 //Admin REMOVEONE Level (MultiLanguage):
  async remove(key: string) {
    const levelToDelete = await this.levelRepo.findOne(key);
    if (!levelToDelete) {
      throw new NotFoundException('Level Not Found!');
    }

    const levelInVideo = await this.videosRepository.findOne({ levelKey: key });
    if (levelInVideo) {
      throw new ConflictException(`The video is linked to this level!`);
    }

    const levelInUser = await this.userRepository.findOne({ levelKey: key });
    if (levelInUser) {
      throw new ConflictException(`The user is linked to this level!`);
    }

    const levelInAudio = await this.audioRepository.findOne({ levelKey: key });
    if (levelInAudio) {
      throw new ConflictException(`The audio is linked to this level!`);
    }

    return await Promise.all([
      this.levelRepo.softDelete({ key: key, deletedAt: IsNull() }),
      this.levelTransRepo.softDelete({ levelKey: key, deletedAt: IsNull() }),
    ]);
  }

# level-admin.controller.ts:
//!Admin REMOVEONE Level (MultiLanguage):
@Delete(':key')
remove(@Param() param) {
  return this.levelService.remove(param.key);
}

###### Admin REMOVEMULTI Levels (MultiLanguage):
# level.service.ts:
//Admin REMOVEMULTI Levels (MultiLanguage):
  async removeMulti(keys: string[]) {
    const levelInVideo = await this.videosRepository.findOne({ levelKey: In(keys) });
    if (levelInVideo) {
      throw new ConflictException(`The video is linked to this level!`);
    }

    const levelInUser = await this.userRepository.findOne({ levelKey: In(keys) });
    if (levelInUser) {
      throw new ConflictException(`The user is linked to this level!`);
    }

    const levelInAudio = await this.audioRepository.findOne({ levelKey: In(keys) });
    if (levelInAudio) {
      throw new ConflictException(`The audio is linked to this level!`);
    }

    const [result] = await Promise.all([
      this.levelRepo.softDelete({ key: In(keys), deletedAt: IsNull() }),
      this.levelTransRepo.softDelete({
        levelKey: In(keys),
        deletedAt: IsNull(),
      }),
    ]);

    const localize = await this.translateService.t('main.entity.level'); //i18n
    if (!result.affected) throw new NotFoundExc(localize);
    return result;
  }
# level-admin.controller.ts:
//!Admin REMOVEMULTI Levels (MultiLanguage):
@Delete()
removeMulti(@Query('keys', ParseArrayPipe) keys: string[]) {
  return this.levelService.removeMulti(keys);
}


###### Client GETALL Levels + No Pagination || Pagination (MultiLanguage):
# level.service:
//!Client GETALL Levels + No Pagination (MultiLanguage):
async findAllByClientNoPagination(
  params: FindManyLevelsDto,
): Promise<Level[]> {
  const { enabled, lang } = params;
  const opts: FindConditions<Level> = {
    ...((enabled && { enabled }) || (enabled == 0 && { enabled })),
  };
  const queryBuilder = this.levelRepo
    .createQueryBuilder('level')
    .orderBy('level.key', 'ASC')
    .innerJoinAndSelect(
      'level.translates',
      'level-translation',
      lang && 'level-translation = :lang',
      {
        lang,
      },
    )
    .where(opts)
    .getMany();

  return queryBuilder;
}

//!Client GETALL Levels + Pagination (MultiLanguage):
async findAllByClientPagination(
  options: IPaginationOptions,
  params: FindManyLevelsDto,
): Promise<Pagination<Level>> {
  const { enabled, lang } = params;
  const opts: FindConditions<Level> = {
    ...((enabled && { enabled }) || (enabled == 0 && { enabled })),
  };
  const queryBuilder = this.levelRepo.createQueryBuilder('level');
  queryBuilder
    .orderBy('level.key', 'ASC')
    .innerJoinAndSelect(
      'level.translates',
      'level-translation',
      lang && 'level-translation.lang = :lang',
      {
        lang,
      },
    )
    .where(opts);

  return paginate<Level>(queryBuilder, options);
}

# level-client.controller.ts:
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LevelService } from '../level.service';
import { FindManyLevelsDto } from '../dto/find-level.dto';
import { BooleanEnum, LangEnum } from 'src/common/constants/global.constant';

@Controller('client/levels')
export class LevelClientController {
  constructor(private readonly levelService: LevelService) {}

  //!Client GETALL Levels + No Pagination || Pagination (MultiLanguage):
  @Get()
  async findAllByClient(
    @Query() params: FindManyLevelsDto, //language, enabled, slug, pageMin=1, limitMin=1
    @Query('page') page: number,
    @Query('limit') limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    params.enabled = BooleanEnum.TRUE; //admin: true or false, client: true
    if (!params.lang) {
      params.lang = LangEnum.En;
    }

    //NoPagination:
    if (!page) return this.levelService.findAllByClientNoPagination(params);

    //Pagination:
    return this.levelService.findAllByClientPagination(
      {
        page: Number(page),
        limit: Number(limit),
        route: `http://localhost:${process.env.PORT}/client/levels?lang=${params.lang}`,
      },
      params,
    );
  }
}





###### Finish Service:
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TranslateService } from '../utils-module/services/translate.service';
import {
  DeepPartial,
  FindConditions,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { LevelTranslation } from './entities/level-translation.entity';
import { Level } from './entities/level.entity';
import slug from 'slug';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FindManyLevelsDto, FindOneLevelDto } from './dto/find-level.dto';
import { ConflictExc, NotFoundExc } from '../common/exceptions/custom.exception';

@Injectable()
export class  LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepo: Repository<Level>,

    @InjectRepository(LevelTranslation)
    private levelTransRepo: Repository<LevelTranslation>,

    private translateService: TranslateService, //i18n
  ) {}

  slugify(key: string) {
    return slug(key, { lower: true }).toString();
  }

  async findOneTransWith(opts: FindConditions<LevelTranslation>) {
    const existTrans = await this.levelTransRepo.findOne({
      where: opts,
    });
    return existTrans;
  }

  //Admin CREATE Level (MultiLanguage):
  async create(createLevelDto: CreateLevelDto): Promise<Level> {
    const { key, description, name, lang, enabled } = createLevelDto;
    //check existTrans of any Level:
    const existTrans = await this.findOneTransWith({ name });
    const levelLocal = await this.translateService.t('main.entity.level'); //i18n
    if (existTrans) throw new ConflictExc(levelLocal);
    //check existLevel:
    const existLevel = await this.levelRepo.findOne({ key: key });
    if (existLevel) throw new ConflictExc(levelLocal);
    //create Level:
    const newLevel = this.levelRepo.create(createLevelDto);
    newLevel.slug = this.slugify(key); //slug
    //create trans for Level:
    const newLevelTrans = this.levelTransRepo.create(createLevelDto);
    newLevel.translates = [newLevelTrans];
    return this.levelRepo.save(newLevel);
  }

  //Admin GETALL Levels + Search(slug) + Pagination (MultiLanguage):
  async findAllByAdmin(
    options: IPaginationOptions,
    params: FindManyLevelsDto,
  ): Promise<Pagination<Level>> {
    const { slug, enabled, lang } = params;
    const opts: FindConditions<Level> = {
      // boolean 1/-1
      ...(enabled && { enabled }),
    };
    const queryBuilder = this.levelRepo.createQueryBuilder('level');
    queryBuilder
      .innerJoinAndSelect(
        'level.translates',
        'levelTranslation', // camel key
        lang && 'levelTranslation.lang = :lang',
        {
          lang,
        },
      )
      .where((sqb) => {
        queryBuilder.where(opts);
        if (slug)
          queryBuilder.andWhere('level.slug LIKE :slug', { slug: `%${slug}` });
      })
      .orderBy('level.key', 'ASC'); // order de duoi cung
    return paginate<Level>(queryBuilder, options);
  }

  //Admin GETONE Level (MultiLanguage):
  async findOne(key: string, params: FindOneLevelDto) {
    const { enabled, lang } = params;
    const existLevel = await this.levelRepo
      .createQueryBuilder('level')
      .innerJoinAndSelect(
        'level.translates',
        'levelTranslation',
        lang && 'levelTranslation.lang = :lang',
        {
          lang,
        },
      )
      .where({
        key,
        ...(enabled && { enabled }),
      })
      .getOne();

    const levelLocal = await this.translateService.t('main.entity.level'); //i18n
    if (!existLevel) {
      throw new NotFoundExc('Not Found ' + levelLocal);
    }
    return existLevel;
  }

  //Admin UPDATEONE Level (MultiLanguage):
  async update(key: string, updateLevelDto: UpdateLevelDto) {
    //cho hết required: true
    const { description, enabled, name, lang } = updateLevelDto;

    //check existLevel:
    const existLevel = await this.levelRepo.findOne({ key });
    if (!existLevel) {
      throw new NotFoundException('Level not found');
    }

    //check existTrans:
    const existTrans = await this.findOneTransWith({
      levelKey: key,
      lang,
    });

    //check existTransName of other Level:
    const existTransName = await this.findOneTransWith({
      levelKey: Not(key),
      name,
    });
    const levelLocal = await this.translateService.t('main.entity.level'); //i18n
    if (existTransName)
      throw new ConflictException('Duplicate TransName ' + levelLocal);

    //update Level:
    //cant update key because it's primary key
    if (description) {
      existLevel.description = description;
    }
    if (enabled) {
      existLevel.enabled = enabled;
    }
    await this.levelRepo.save(existLevel);

    //update Trans:
    //existTrans -> update, !existTrans -> add new:
    const payloadLevelTranslate: DeepPartial<LevelTranslation> = {
      ...(existTrans && { id: existTrans.id }),
      levelKey: key,
      ...updateLevelDto,
    };

    await this.levelTransRepo.save(payloadLevelTranslate);
    return this.findOne(key, { lang: lang });
  }

  //Admin REMOVEONE Level (MultiLanguage):
  async remove(key: string) {
    const levelToDelete = await this.levelRepo.findOne(key);
    if (!levelToDelete) {
      throw new NotFoundException('Level Not Found!');
    }
    return await Promise.all([
      this.levelRepo.softDelete({ key: key, deletedAt: IsNull() }),
      this.levelTransRepo.softDelete({ levelKey: key, deletedAt: IsNull() }),
    ]);
  }

  //Admin REMOVEMULTI Levels (MultiLanguage):
  async removeMulti(keys: string[]) {
    const [result] = await Promise.all([
      this.levelRepo.softDelete({ key: In(keys), deletedAt: IsNull() }),
      this.levelTransRepo.softDelete({
        levelKey: In(keys),
        deletedAt: IsNull(),
      }),
    ]);

    const localize = await this.translateService.t('main.entity.level'); //i18n
    if (!result.affected) throw new NotFoundExc(localize);
    return result;
  }

  //Client GETALL Levels + No Pagination (MultiLanguage):
  async findAllByClientNoPagination(
    params: FindManyLevelsDto,
  ): Promise<Level[]> {
    const { enabled, lang } = params;
    const opts: FindConditions<Level> = {
      ...(enabled && { enabled }),
    };
    const queryBuilder = this.levelRepo
      .createQueryBuilder('level')
      .innerJoinAndSelect(
        'level.translates',
        'levelTranslation',
        lang && 'levelTranslation.lang = :lang',
        {
          lang,
        },
      )
      .where(opts)
      .orderBy('level.key', 'ASC')
      .getMany();

    return queryBuilder;
  }

  //Client GETALL Levels + Pagination (MultiLanguage):
  async findAllByClientPagination(
    options: IPaginationOptions,
    params: FindManyLevelsDto,
  ): Promise<Pagination<Level>> {
    const { enabled, lang } = params;
    const opts: FindConditions<Level> = {
      ...(enabled && { enabled }),
    };
    const queryBuilder = this.levelRepo.createQueryBuilder('level');
    queryBuilder
      .innerJoinAndSelect(
        'level.translates',
        'levelTranslation',
        lang && 'levelTranslation.lang = :lang',
        {
          lang,
        },
      )
      .where(opts)
      .orderBy('level.key', 'ASC');

    return paginate<Level>(queryBuilder, options);
  }
}



###### Finish Admin Controller:
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  Put,
  ParseArrayPipe,
} from '@nestjs/common';
import { LevelService } from '../level.service';
import { CreateLevelDto } from '../dto/create-level.dto';
import { UpdateLevelDto } from '../dto/update-level.dto';
import { Level } from '../entities/level.entity';
import { FindManyLevelsDto, FindOneLevelDto } from '../dto/find-level.dto';
import { LangEnum } from '../../common/constants/global.constant';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('admin/levels')
export class LevelAdminController {
  constructor(private readonly levelService: LevelService) {}

  //Admin CREATE Level (MultiLanguage):
  @Post()
  // @UsePipes(ValidationPipe)
  async create(@Body() createLevelDto: CreateLevelDto): Promise<Level> {
    return this.levelService.create(createLevelDto);
  }

  //Admin GETALL Levels + Search(slug) + Pagination (MultiLanguage):
  @Get()
  // @UsePipes(ValidationPipe)
  async findAllByAdmin(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() params: FindManyLevelsDto, //language, enabled, slug, pageMin=1, limitMin=1
  ): Promise<Pagination<Level>> {
    limit = limit > 100 ? 100 : limit;
    if (!params.lang) {
      params.lang = LangEnum.En;
    }
    // if (!params.enabled) { params.enabled = BooleanEnum.TRUE }

    return this.levelService.findAllByAdmin({ page, limit }, params);
  }

  //Admin GETONE Level (MultiLanguage):
  @Get(':key')
  // @UsePipes(ValidationPipe)
  async findOne(@Param('key') key: string, @Query() params: FindOneLevelDto) {
    if (!params.lang) {
      params.lang = LangEnum.En;
    }
    return this.levelService.findOne(key, params);
  }

  //Admin UPDATEONE Level (MultiLanguage):
  @Put(':key')
  // @UsePipes(ValidationPipe)
  async update(
    @Param('key') key: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    return this.levelService.update(key, updateLevelDto);
  }

  //Admin REMOVEONE Level (MultiLanguage):
  @Delete(':key')
  async remove(@Param() param) {
    return this.levelService.remove(param.key);
  }

  //Admin REMOVEMULTI Levels (MultiLanguage):
  @Delete()
  async removeMulti(@Query('keys', ParseArrayPipe) keys: string[]) {
    return this.levelService.removeMulti(keys);
  }
}


###### Finish Client Controller:
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LevelService } from '../level.service';
import { FindManyLevelsDto } from '../dto/find-level.dto';
import { BooleanEnum, LangEnum } from '../../common/constants/global.constant';

@Controller('client/levels')
export class LevelClientController {
  constructor(private readonly levelService: LevelService) {}

  //Client GETALL Levels + No Pagination || Pagination (MultiLanguage):
  @Get()
  async findAllByClient(
    @Query() params: FindManyLevelsDto, //language, enabled, slug, pageMin=1, limitMin=1
    @Query('page') page: number,
    @Query('limit') limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    params.enabled = BooleanEnum.TRUE; //admin: true or false, client: true
    if (!params.lang) {
      params.lang = LangEnum.En;
    }

    //NoPagination:
    if (!page) return this.levelService.findAllByClientNoPagination(params);

    //Pagination:
    return this.levelService.findAllByClientPagination(
      {
        page: Number(page),
        limit: Number(limit),
        route: `http://localhost:${process.env.PORT}/client/levels?lang=${params.lang}`,
      },
      params,
    );
  }
}
