import {
  ConflictException, Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination
} from 'nestjs-typeorm-paginate';
import slug from 'slug';
import { AudioRepository } from '../audio/repository/audio.repository';
import { UserRepository } from '../user/repository/user.repository';
import { VideosRepository } from '../videos/repositories/videos.repository';
import {
  DeepPartial,
  FindConditions,
  In,
  IsNull,
  Not,
  Repository
} from 'typeorm';
import { ConflictExc, NotFoundExc } from '../common/exceptions/custom.exception';
import { TranslateService } from '../utils-module/services/translate.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { FindManyLevelsDtoClient } from './dto/find-level-client.dto';
import { FindManyLevelsDto, FindOneLevelDto } from './dto/find-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { LevelTranslation } from './entities/level-translation.entity';
import { Level } from './entities/level.entity';
import { LevelTranslationRepository } from './repositories/topic-translation.repository';
import { LevelRepository } from './repositories/topic.repository';

@Injectable()
export class  LevelService {
  constructor(
    private levelRepo: LevelRepository,
    private levelTransRepo: LevelTranslationRepository,
    private translateService: TranslateService, //i18n
    private videosRepository: VideosRepository,
    private userRepository: UserRepository,
    private audioRepository: AudioRepository,
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
    const { key, description, name, lang } = createLevelDto;
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
    const { slug, lang } = params;
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
        if (slug)
          queryBuilder.andWhere('level.slug LIKE :slug', { slug: `%${slug}` });
      })
      .orderBy('level.key', 'ASC');
    return paginate<Level>(queryBuilder, options);
  }

  //Admin GETONE Level (MultiLanguage):
  async findOne(slug: string, params: FindOneLevelDto) {
    const { lang } = params;
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
        slug,
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
    const { description, name, lang } = updateLevelDto;

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
    await this.levelRepo.save(existLevel);

    //update Trans:
    //existTrans -> update, !existTrans -> add new:
    const payloadLevelTranslate: DeepPartial<LevelTranslation> = {
      ...(existTrans && { id: existTrans.id }),
      levelKey: key,
      ...updateLevelDto,
    };

    await this.levelTransRepo.save(payloadLevelTranslate);

    return this.findOne(this.slugify(key), { lang: lang });
  }

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

  //Client GETALL Levels + No Pagination (MultiLanguage):
  async findAllByClientNoPagination(
    params: FindManyLevelsDtoClient,
  ): Promise<Level[]> {
    const { lang } = params;
    const queryBuilder = await this.levelRepo
      .createQueryBuilder('level')
      .innerJoinAndSelect(
        'level.translates',
        'levelTranslation',
        lang && 'levelTranslation.lang = :lang',
        {
          lang,
        },
      )
      .orderBy('level.key', 'ASC')
      .getMany();

    return queryBuilder;
  }

  //Client GETALL Levels + Pagination (MultiLanguage):
  async findAllByClientPagination(
    options: IPaginationOptions,
    params: FindManyLevelsDtoClient,
  ): Promise<Pagination<Level>> {
    const {lang } = params;
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
      .orderBy('level.key', 'ASC');

    return paginate<Level>(queryBuilder, options);
  }
}
