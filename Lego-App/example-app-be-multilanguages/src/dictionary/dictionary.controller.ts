import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DictionaryService } from './dictionary.service';

@Controller('dictionary')
@ApiTags('Dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @Get()
  getDictForDev() {
    return this.dictionaryService.getDictForDev();
  }
}
