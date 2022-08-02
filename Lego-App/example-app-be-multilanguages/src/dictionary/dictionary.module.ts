import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvDictRepository } from './repository/video-highlight-words.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EvDictRepository])],
  controllers: [DictionaryController],
  providers: [DictionaryService],
})
export class DictionaryModule {}
