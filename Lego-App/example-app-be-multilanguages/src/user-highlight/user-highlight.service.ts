import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { In } from 'typeorm';
import { MediaType } from '../common/enums/global.enum';
import { ExpectationFailedExc } from '../common/exceptions/custom.exception';
import { EvDictRepository } from '../dictionary/repository/video-highlight-words.repository';
import { User } from '../user/entities/user.entity';
import { AddHighlightWordReqDto } from './dtos/req/add-highlight-word.req.dto';
import { DeleteHighlightWordReqDto } from './dtos/req/delete-highlight-words.req.dto';
import { UserHighlightWords } from './entities/user-highlight-word.entity';
import { UserHighlightWordsRepository } from './repositories/user-highlight-words.repository';

@Injectable()
export class UserHighlightService {
  constructor(
    private userHighlightWordRepo: UserHighlightWordsRepository,
    private evdictRepo: EvDictRepository,
  ) {}

  async addUserHighlightWord(data: AddHighlightWordReqDto, user: User) {
    const { audioId, mediaType, word, videoId } = data;
    let userHighlightWord: UserHighlightWords;

    if (mediaType === MediaType.VIDEO) {
      userHighlightWord = this.userHighlightWordRepo.create({
        mediaType,
        user,
        videoId,
      });
    }
    if (mediaType === MediaType.AUDIO) {
      userHighlightWord = this.userHighlightWordRepo.create({
        mediaType,
        user,
        audioId,
      });
    }
    if (!userHighlightWord)
      throw new InternalServerErrorException('MediaType is not valid');

    const evdict = await this.evdictRepo.findOne({ word });
    if (!evdict) throw new ExpectationFailedExc();

    userHighlightWord.userId = user.id;
    userHighlightWord.evDict = evdict;
    return this.userHighlightWordRepo.save(userHighlightWord);
  }

  async getUserHighlightWord(user: User) {
    return this.userHighlightWordRepo.find({ userId: user.id });
  }

  async deleteUserHighlightWords(data: DeleteHighlightWordReqDto, user: User) {
    const { highlightIds } = data;
    const result = await this.userHighlightWordRepo.softDelete({
      userId: user.id,
      id: In(highlightIds),
    });
    return { deleted: result.affected };
  }
}
