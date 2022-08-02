import { TranscriptionJobStatus } from '@aws-sdk/client-transcribe';
import { Injectable } from '@nestjs/common';
import { paginate } from 'nestjs-typeorm-paginate';
import { EntityManager, In, IsNull } from 'typeorm';
import { SupportFileType } from '../common/constants/global.constant';
import {
  BadRequestExc,
  ConflictExc,
  InternalServerErrorExc,
  NotFoundExc,
} from '../common/exceptions/custom.exception';
import { beautifyTranscript } from '../common/helpers/transcript.helper';
import { useTransaction } from '../common/transaction/useTransaction';
import { FileService } from '../file/file.service';
import { AudioToTextService } from '../utils-module/services/audio-to-text.service';
import { UploadService } from '../utils-module/services/upload-file.service';
import { EvDictRepository } from '../dictionary/repository/video-highlight-words.repository';
import { AddHighlightWordDto } from './dto/req/add-highlight-word.dto';
import { CreateAudioDto } from './dto/req/create-audio.dto';
import { DeleteAudiosReqDto } from './dto/req/delete-audio.dto';
import { DeleteHighlightWordDto } from './dto/req/delete-highlight-word.dto';
import { GetAudioListReqDto } from './dto/req/get-audio-list.req.dto';
import { Audio } from './entities/audio.entity';
import { AudioHighlightWordsRepository } from './repository/audio-highlight-words.repository';
import { AudioThumbnailRepository } from './repository/audio-thumbnail.repository';
import { AudioTranscriptRepository } from './repository/audio-transcript.repository';
import { AudioTypesRepository } from './repository/audio-types.repository';
import { AudioRepository } from './repository/audio.repository';
import { AudiosToTopicsRepository } from './repository/audios-to-topics.repository';
import { UpdateAudioDto } from './dto/req/update-audio.dto';
import { UpdateAudioTranscriptDto } from './dto/req/update-audio-transcript.dto';
import { RemoveAudioTopicDto } from './dto/req/remove-audio-topic.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AudioService {
  constructor(
    private audioRepository: AudioRepository,
    private audioTypesRepository: AudioTypesRepository,
    private audioThumbnailRepository: AudioThumbnailRepository,
    private audioTranscriptRepository: AudioTranscriptRepository,
    private audioHighlightWordsRepository: AudioHighlightWordsRepository,
    private fileService: FileService,
    private audioToTextService: AudioToTextService,
    private uploadService: UploadService,
    private evDictRepository: EvDictRepository,
    private audiosToTopicsRepository: AudiosToTopicsRepository,
  ) {}

  async create(createAudioDto: CreateAudioDto) {
    const {
      audioCode,
      audioTypeKey,
      title,
      desc,
      fileId,
      audioThumbnailId,
      topicKeys,
      levelKey,
    } = createAudioDto;

    // validate audio and thumbnail file
    await this.fileService.findOneOrError(fileId);
    await this.fileService.findOneOrError(audioThumbnailId);

    const audiosToTopics = topicKeys.map((topicKey) =>
      this.audiosToTopicsRepository.create({
        topicKey,
      }),
    );

    const newAudio = {
      audioCode,
      audioTypeKey,
      title,
      desc,
      audiosToTopics,
      levelKey,
    };

    const transactionResult = await useTransaction(
      async (manager: EntityManager) => {
        const createdAudio = await this.audioRepository.saveAudio(
          manager,
          newAudio,
        );
        const newAudioThumbnail = {
          audioId: createdAudio.id,
          fileId,
          thumbnailId: audioThumbnailId,
        };
        await this.audioThumbnailRepository.saveAudioThumbnail(
          manager,
          newAudioThumbnail,
        );
        return createdAudio;
      },
    );

    if (!transactionResult) throw new ConflictExc();

    const result = await this.getOneWithThumbnail(transactionResult.id);

    return result;
  }

  async update(id: number, body: UpdateAudioDto) {
    const {
      audioCode,
      audioTypeKey,
      title,
      desc,
      topicKeys,
      levelKey,
      fileId,
      audioThumbnailId,
    } = body;

    const existedAudio = await this.audioRepository.findOneOrFail(id);

    // validate audio and thumbnail file
    await this.fileService.findOneOrError(fileId);
    await this.fileService.findOneOrError(audioThumbnailId);

    // remove topic misssing from existed audio
    const existedAudiosToTopics = await this.audiosToTopicsRepository.find({
      where: {
        audioId: id,
      },
    });
    if (existedAudiosToTopics) {
      existedAudiosToTopics.forEach((topic) => {
        if (!topicKeys.includes(topic.topicKey)) {
          this.audiosToTopicsRepository.delete(topic.id);
        }
      });
    }
    const audiosToTopics = [];

    topicKeys.forEach(async (topicKey) => {
      const existedAudiosToTopics =
        await this.audiosToTopicsRepository.findOneOrFail({
          where: {
            audioId: id,
            topicKey,
          },
        });
      if (!existedAudiosToTopics) {
        audiosToTopics.push(
          this.audiosToTopicsRepository.create({
            topicKey,
          }),
        );
      } else {
        audiosToTopics.push(existedAudiosToTopics);
      }
    });

    existedAudio.audioCode = audioCode || existedAudio.audioCode;
    existedAudio.audioTypeKey = audioTypeKey || existedAudio.audioTypeKey;
    existedAudio.title = title || existedAudio.title;
    existedAudio.desc = desc || existedAudio.desc;
    existedAudio.audiosToTopics = audiosToTopics || existedAudio.audiosToTopics;
    existedAudio.levelKey = levelKey || existedAudio.levelKey;

    const transactionResult = await useTransaction(
      async (manager: EntityManager) => {
        const updatedAudio = await this.audioRepository.updateAudio(
          manager,
          existedAudio,
        );
        if (fileId || audioThumbnailId) {
          const existedAudioThumbnail =
            await this.audioThumbnailRepository.findOneOrFail({ audioId: id });

          existedAudioThumbnail.fileId = fileId;
          existedAudioThumbnail.thumbnailId = audioThumbnailId;
          await this.audioThumbnailRepository.updateAudioThumbnail(
            manager,
            existedAudioThumbnail,
          );
        }

        return updatedAudio;
      },
    );

    if (!transactionResult) throw new ConflictExc();

    const result = await this.getOneWithThumbnail(transactionResult.id);

    return result;
  }

  async updateAudioTranscript(
    id: number,
    transcript: UpdateAudioTranscriptDto,
  ) {
    const audioTranscript = await this.audioTranscriptRepository.findOne(id);
    if (!audioTranscript) throw new NotFoundExc(`Audio transcript not found`);

    audioTranscript.content = transcript.content;
    audioTranscript.startTime = parseFloat(transcript.startTime);
    return this.audioTranscriptRepository.save(audioTranscript);
  }

  async saveAudioTranscript(audioId: number) {
    console.log('save');
    const audio = await this.audioRepository.findOneOrFail(audioId);
    const data: any = await this.uploadService.getObject(
      `AUDIO-${audio.audioCode}.json`,
    );
    const parsedData = JSON.parse(data);
    if (parsedData.status !== TranscriptionJobStatus.COMPLETED) {
      throw new BadRequestExc('Transcript for this audio is not ready');
    }

    // prepare data for saving db
    const preparedData = beautifyTranscript(audioId, parsedData.results.items);
    if (preparedData.length === 0) {
      throw new InternalServerErrorExc();
    }

    preparedData.forEach(async (item) => {
      const createdAudioTranscript = this.audioTranscriptRepository.create({
        startTime: parseFloat(item.start_time),
        audioId,
        content: item.content,
      });
      await this.audioTranscriptRepository.save(createdAudioTranscript, {
        chunk: 10,
      });
    });
  }

  async getListAudioTranscriptStatus(jobNameContains: string) {
    return this.audioToTextService.getListTranscribeJob(jobNameContains);
  }

  async convertAudioToText(user: User, audioId: number) {
    // validate
    const audio = await this.audioRepository.findOneOrFail(audioId);
    const audioThumbnail = await this.audioThumbnailRepository.findOneOrFail({
      audioId,
    });
    const audioFile = await this.fileService.findOneOrError(
      audioThumbnail.fileId,
    );
    const result = await this.startTranscribeJob(
      user.id,
      audioFile.url,
      audio.audioCode,
      audioFile.type,
    );
    return result;
  }

  async startTranscribeJob(
    userId: number,
    url: string,
    audioCode: string,
    mediaFormat: SupportFileType,
  ) {
    return this.audioToTextService.createTranscribeJob(
      userId,
      url,
      audioCode,
      mediaFormat,
    );
  }

  async getOne(id: number) {
    return this.audioRepository.findOneOrFail(id);
  }

  async getOneWithThumbnail(id: number) {
    return this.audioRepository
      .createQueryBuilder('audios')
      .leftJoinAndSelect('audios.audioHighlightWords', 'audioHighlightWords')
      .leftJoinAndSelect('audios.audioTranscripts', 'audiosTranscripts')
      .orderBy('audiosTranscripts.startTime', 'ASC')
      .leftJoinAndSelect('audioHighlightWords.evDict', 'evDict')
      .leftJoinAndSelect('audios.audioThumbnail', 'audioThumbnail')
      .leftJoinAndSelect('audioThumbnail.file', 'file')
      .leftJoinAndSelect('audioThumbnail.thumbnail', 'thumbnail')
      .leftJoinAndSelect('audios.audiosToTopics', 'audiosToTopics')
      .leftJoinAndSelect('audiosToTopics.topic', 'topic')
      .leftJoinAndSelect('topic.translates', 'topicTranslations')
      .leftJoinAndSelect('audios.level', 'level')
      .leftJoinAndSelect('level.translates', 'levelTranslations')
      .where('audios.id = :id', { id })
      .getOne();
  }

  async getAudioList(data: GetAudioListReqDto, baseRoute: string) {
    const { page, search, limit, topicKey, levelKey } = data;
    // TODO: Load level and topic relation
    const queryBuilder = this.audioRepository
      .createQueryBuilder('audios')
      .leftJoinAndSelect('audios.audiosToTopics', 'audiosToTopics')
      .select('audios.id')
      .groupBy('audios.id');

    let route = baseRoute;
    if (search) {
      queryBuilder.andWhere('audio_code ILIKE :search', {
        search: `%${search}%`,
      });
      route += `?search=${search}`;
    }

    if (topicKey) {
      queryBuilder.andWhere('audiosToTopics.topicKey = :topicKey', {
        topicKey,
      });
      route += `?topicKey=${topicKey}`;
    }

    if (levelKey) {
      queryBuilder.andWhere('audios.levelKey = :levelKey', {
        levelKey,
      });
      route += `?levelKey=${levelKey}`;
    }

    const result = await paginate<Audio>(queryBuilder, {
      page,
      limit,
      route,
    });

    return new Pagination<Audio>(
      await Promise.all(
        result.items.map(async (audiosHasId) => {
          const audio = await this.audioRepository
            .createQueryBuilder('audios')
            .leftJoinAndSelect('audios.audioThumbnail', 'audioThumbnail')
            .leftJoinAndSelect('audioThumbnail.file', 'file')
            .leftJoinAndSelect('audioThumbnail.thumbnail', 'thumbnail')
            .leftJoinAndSelect('audios.audiosToTopics', 'audiosToTopics')
            .leftJoinAndSelect('audiosToTopics.topic', 'topic')
            .leftJoinAndSelect('topic.translates', 'topicTranslations')
            .leftJoinAndSelect('audios.level', 'level')
            .leftJoinAndSelect('level.translates', 'levelTranslations')
            .where('audios.id = :id', { id: audiosHasId.id })
            .getOne();
          return audio;
        }),
      ),
      result.meta,
      result.links,
    );
  }

  async deleteAudios(data: DeleteAudiosReqDto) {
    const { ids } = data;
    const [resultFist] = await Promise.all([
      this.audioRepository.softDelete(ids),
      this.audioThumbnailRepository.softDelete({
        audioId: In(ids),
        deletedAt: IsNull(),
      }),
      this.audioTranscriptRepository.softDelete({
        audioId: In(ids),
        deletedAt: IsNull(),
      }),
      this.audiosToTopicsRepository.softDelete({
        audioId: In(ids),
        deletedAt: IsNull(),
      }),
    ]);
    if (!resultFist.affected) {
      throw new NotFoundExc('Audio');
    }
  }

  async removeAudioTopic(data: RemoveAudioTopicDto) {
    const { audioToTopicId } = data;
    return this.audiosToTopicsRepository.softDelete(audioToTopicId);
  }

  async highlightWords(data: AddHighlightWordDto) {
    const { audioId, words } = data;
    await this.audioRepository.findOneOrFail({
      id: audioId,
    });
    const notExists = [];
    const highlightWordsDictIds = await Promise.all(
      words.map(async (highlightWord) => {
        const highlightWordsDictId = await this.evDictRepository.findOne({
          where: { word: highlightWord },
        });
        if (highlightWordsDictId) return highlightWordsDictId;
        notExists.push(highlightWord);
        console.log(`${highlightWord} doesn't exist in dictionary`);
      }),
    );
    // Filter words not in dictionary
    highlightWordsDictIds.filter(Boolean).map(async (transcript) => {
      const created = this.audioHighlightWordsRepository.create({
        audioId,
        evDictId: transcript.idx,
      });
      return this.audioHighlightWordsRepository.save(created);
    });
    return { notExists };
  }

  async removeHighlightWord(data: DeleteHighlightWordDto) {
    const { audioId, word } = data;
    const audio = await this.audioRepository.findOne({
      id: audioId,
    });
    if (!audio) throw new NotFoundExc(`Audio ${audioId} doesn't exist`);
    const highlightWordsDictId = await this.evDictRepository.findOne({
      word,
    });
    if (!highlightWordsDictId) throw new NotFoundExc(`${word} doesn't exist`);
    return this.audioHighlightWordsRepository.softDelete({
      audioId: audioId,
      evDictId: highlightWordsDictId.idx,
    });
  }
}
