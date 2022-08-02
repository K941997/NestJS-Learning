import { Injectable } from '@nestjs/common';
import { EvDictRepository } from './repository/video-highlight-words.repository';

@Injectable()
export class DictionaryService {
  constructor(private evDictRepo: EvDictRepository) {}

  async getDictForDev() {
    return this.evDictRepo.find();
  }
}
