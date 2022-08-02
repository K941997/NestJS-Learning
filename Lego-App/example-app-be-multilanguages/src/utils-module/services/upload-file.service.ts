import { Injectable } from '@nestjs/common';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import {
  GetObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ConfigGetOptions, ConfigService } from '@nestjs/config';
import { IGlobalConfig } from '../../common/config/global.config';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { UuidService } from './uuid.service';
import path from 'path';

@Injectable()
export class UploadService {
  constructor(
    private configService: ConfigService<IGlobalConfig>,
    private httpService: HttpService,
    private uuidService: UuidService,
  ) {}

  async createPresignUrl(bucket: string, key: string) {
    const s3Client = this.getS3();
    const s3Config = this.getS3Config();
    const fieldsPresign = {
      acl: 'public-read',
    };

    const data = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: key,
      Conditions: [
        ['content-length-range', 0, s3Config.maxSize * 1000000], // content length restrictions: 0-30MB
        // ['starts-with', '$Content-Type', 'image/'], // content type restriction
        // ['eq', '$x-amz-meta-userid', userid], // tag with userid <= the user can see this!
      ],
      Fields: fieldsPresign,
      Expires: s3Config.timeOutMinute * 60, //Seconds before the presigned post expires. 3600 by default.
    });

    return data;
  }

  async getObject(name: string) {
    const s3Config = this.getS3Config();
    const s3Client = this.getS3();
    const cmd = new GetObjectCommand({
      Bucket: s3Config.bucket,
      Key: name,
      // Key: 'JOB-7b2055a9-4610-44e7-935c-8c8f7be589ec.json',
    });
    const data = await s3Client.send(cmd);

    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });

    const json = await streamToString(data.Body);
    return json;
  }

  /**
   * User this function to upload image from url direct from server
   * and not using presign URL (not recommended) but URL upload had CORS issue
   * so we can only use this function.
   */
  async uploadFromUrl(url: string) {
    const s3Client = this.getS3();
    const s3Config = this.getS3Config();
    const extFile = this.getExtension(url);
    const nameFile = this.uuidService.genRandomStr() + extFile; // audio or image before.

    return this.httpService
      .get(encodeURI(url), {
        responseType: 'stream',
      })
      .pipe(
        map(async (res) => {
          const target: PutObjectCommandInput = {
            ACL: 'public-read',
            Bucket: s3Config.bucket,
            Key: nameFile,
            Body: res.data,
          };

          try {
            const parallelUploads3 = new Upload({
              client: s3Client,
              params: target,
            });

            parallelUploads3.on('httpUploadProgress', (progress) => {
              // console.log('progress', progress);
              // return 'success';
            });

            const data = await parallelUploads3.done();

            //TODO: Need to create response include URL file here.
            // https://clevertube-s3-dev1-bucket.s3.ap-northeast-1.amazonaws.com/1f67f169-f3ab-44e3-a6cb-7af90156a4fd.jpg
            // https://clevertube-s3-dev1-bucket.s3.ap-northeast-1.amazonaws.com/246061fa-628e-40af-b708-39704eed451b.mp3
            return `${s3Config.bucket}/${nameFile}`;
          } catch (e) {
            console.log(e);
          }
        }),
      );
  }

  private getS3() {
    const s3Config = this.getS3Config();
    return new S3Client({
      credentials: {
        accessKeyId: s3Config.accessKeyId,
        secretAccessKey: s3Config.secretAccessKey,
      },
      region: s3Config.region,
    });
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

  private getExtension(filePath: string) {
    let mimetype = path.extname(filePath);
    mimetype = mimetype.split('/').pop();
    mimetype = mimetype.includes('+') ? mimetype.split('+').shift() : mimetype;
    mimetype = mimetype.includes('?') ? mimetype.split('?').shift() : mimetype;
    return mimetype;
  }
}
