import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule } from 'nestjs-i18n';
import path from 'path';
import dbConfig from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioModule } from './audio/audio.module';
import { FirebaseAuthStrategy } from './auth/strategy/firebase-auth.strategy';
import { CaslModule } from './casl/casl.module';
import globalConfig from './common/config/global.config';
import i18nConfigOptions from './common/config/i18n.config';
import { DictionaryModule } from './dictionary/dictionary.module';
import { FileModule } from './file/file.module';
import { LevelModule } from './level/level.module';
import { SearchModule } from './search/search.module';
import { TopicModule } from './topic/topic.module';
import { UserHighlightModule } from './user-highlight/user-highlight.module';
import { UserModule } from './user/user.module';
import { UtilsModule } from './utils-module/utils.module';
import { VideosModule } from './videos/videos.module';

// console.log('dbConfig', dbConfig);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig],
    }),
    I18nModule.forRoot({
      ...i18nConfigOptions,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    TypeOrmModule.forRoot(dbConfig),
    UtilsModule,
    UserModule,
    CaslModule,
    VideosModule,
    DictionaryModule,
    UserHighlightModule,
    FileModule,
    AudioModule,
    LevelModule,
    TopicModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
    FirebaseAuthStrategy,
  ],
})
export class AppModule {}
