import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvDictRepository } from '../dictionary/repository/video-highlight-words.repository';
import { UserHighlightWordsRepository } from './repositories/user-highlight-words.repository';
import { UserHighlightController } from './user-highlight.controller';
import { UserHighlightService } from './user-highlight.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserHighlightWordsRepository, EvDictRepository]),
  ],
  controllers: [UserHighlightController],
  providers: [UserHighlightService],
})
export class UserHighlightModule {}
