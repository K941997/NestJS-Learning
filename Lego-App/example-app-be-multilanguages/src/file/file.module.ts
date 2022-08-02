import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from '../utils-module/services/upload-file.service';
import { UtilsModule } from '../utils-module/utils.module';
import { File } from './entities/file.entity';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { FileSubscriber } from './subscriber/file.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileRepository, File]),
    HttpModule,
    UtilsModule,
  ],
  controllers: [FileController],
  providers: [FileService, FileSubscriber, UploadService],
})
export class FileModule {}
