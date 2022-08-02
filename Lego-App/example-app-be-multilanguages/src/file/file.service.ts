import { Injectable } from '@nestjs/common';
import { ConfigGetOptions, ConfigService } from '@nestjs/config';
import { FindConditions } from 'typeorm';
import { IGlobalConfig } from '../common/config/global.config';
import {
  MapFilePathSupport,
  SupportFileType,
} from '../common/constants/global.constant';
import {
  ConflictExc,
  InternalServerErrorExc,
  NotFoundExc,
} from '../common/exceptions/custom.exception';
import { User } from '../user/entities/user.entity';
import { UploadService } from '../utils-module/services/upload-file.service';
import { UuidService } from '../utils-module/services/uuid.service';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './entities/file.entity';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private configService: ConfigService<IGlobalConfig>,
    private uploadService: UploadService,
    private uuidService: UuidService,
  ) {}

  async createPresignUpload(type: SupportFileType, user: User) {
    const s3Config = this.getS3Config();

    const randomStr = this.uuidService.genRandomStr();

    // Check if type is in name folder, We need to check type, to detect file from image/video/pdf
    const objFolder = MapFilePathSupport.find((obj) => {
      return obj.types.includes(type);
    });
    if (!objFolder) {
      throw new InternalServerErrorExc();
    }

    const key = `${objFolder.key}/${user.id}/${randomStr}.${type}`;
    const baseUrl = `https://s3.${s3Config.region}.amazonaws.com/${s3Config.bucket}`;
    // Create file and save to database
    const params: CreateFileDto = {
      key,
      bucket: s3Config.bucket,
      uploaderId: user.id,
      type: type,
      baseUrl,
    };

    const audio = await this.create(params);
    const presign = await this.uploadService.createPresignUrl(
      s3Config.bucket,
      key,
    );
    return { audio, presign };
  }

  async uploadFromUrl(url: string) {
    return this.uploadService.uploadFromUrl(url);
  }

  async create(createFileDto: CreateFileDto) {
    const { key } = createFileDto;
    const exist = await this.findOneWith({ key });
    if (exist) throw new ConflictExc(`${key}`);

    const newFileAdmin = this.fileRepository.create(createFileDto);
    console.log(newFileAdmin);
    return await this.fileRepository.save(newFileAdmin);
  }

  async findOneWith(opts: FindConditions<File>) {
    const exist = await this.fileRepository.findOne({
      where: opts,
    });
    return exist;
  }

  async findOneOrError(id: number) {
    const exist = await this.fileRepository.findOne(id);
    if (!exist) throw new NotFoundExc();
    return exist;
  }

  private getS3Config() {
    const option: ConfigGetOptions = {
      infer: true,
    };
    const maxSize = this.configService.get('s3.awsS3LimitSizeMb', option);
    const timeOutMinute = this.configService.get(
      's3.awsS3PresignTimeOut',
      option,
    );
    const accessKeyId = this.configService.get('s3.awsAccessKeyId', option);
    const secretAccessKey = this.configService.get(
      's3.awsSecretAccessKey',
      option,
    );
    const region = this.configService.get('s3.awsS3Region', option);
    const bucket = this.configService.get('s3.awsS3BucketName', option);
    return {
      maxSize,
      timeOutMinute,
      accessKeyId,
      secretAccessKey,
      region,
      bucket,
    };
  }
}
