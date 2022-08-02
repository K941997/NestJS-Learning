import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioRepository } from '../audio/repository/audio.repository';
import { VideosRepository } from '../videos/repositories/videos.repository';
import { SearchClientController } from './controllers/search-client.controller';
import { UserSearchsRepository } from './repositories/user-highlight-words.repository';
import { SearchClientService } from './services/search-client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSearchsRepository,
      VideosRepository,
      AudioRepository,
    ]),
  ],
  controllers: [SearchClientController],
  providers: [SearchClientService],
})
export class SearchModule {}
