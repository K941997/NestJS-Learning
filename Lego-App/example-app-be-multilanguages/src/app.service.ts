import { YoutubeTranscriptService } from './utils-module/services/youtube-transcript.service';
import { Injectable } from '@nestjs/common';
import { AudioToTextService } from './utils-module/services/audio-to-text.service';
import { UploadService } from './utils-module/services/upload-file.service';
import { ConfigGetOptions, ConfigService } from '@nestjs/config';
import { IGlobalConfig } from './common/config/global.config';

@Injectable()
export class AppService {
  // constructor(
  //   private youtubeTranscript: YoutubeTranscriptService,
  //   private audioToTextTranscript: AudioToTextService,
  //   private uploadService: UploadService,
  //   private configService: ConfigService<IGlobalConfig>,
  // ) {}
  // getHello(email: string): string {
  //   return 'Hello World! I am ' + email + '!';
  // }
  // async getWiki(query: string) {
  //   // const doc = await wtf.fetch(query);
  //   // //get the image json
  //   // const images = doc.images().map((img) => img.json());
  //   // return { image: images[0] };
  //   return '';
  // }
  // async getYtTranscript(videoId: string) {
  //   const transcript = await this.youtubeTranscript.fetchTranscript(videoId);
  //   return { transcript };
  // }
  // // async createAudioTranscript(url: string) {
  // //   return this.audioToTextTranscript.createTranscribeJob(url);
  // // }
  // // async getListTranscribeJob() {
  // // return this.uploadService.getObject();
  // // return this.audioToTextTranscript.getDetailTranscribeJob();
  // // return this.audioToTextTranscript.getListTranscribeJob();
  // // }
  // async uploadFromUrl(url: string) {
  //   return this.uploadService.uploadFromUrl(url);
  // }
  // async createPresignUpload(type: string) {
  //   const s3Config = this.getS3Config();
  //   return this.uploadService.createPresignUrl(s3Config.bucket, type);
  // }
  // private getS3Config() {
  //   const option: ConfigGetOptions = {
  //     infer: true,
  //   };
  //   const maxSize = this.configService.get('s3.awsS3LimitSizeMb', option);
  //   const timeOutMinute = this.configService.get(
  //     's3.awsS3PresignTimeOut',
  //     option,
  //   );
  //   const accessKeyId = this.configService.get('s3.awsAccessKeyId', option);
  //   const secretAccessKey = this.configService.get(
  //     's3.awsSecretAccessKey',
  //     option,
  //   );
  //   const region = this.configService.get('s3.awsS3Region', option);
  //   const bucket = this.configService.get('s3.awsS3BucketName', option);
  //   return {
  //     maxSize,
  //     timeOutMinute,
  //     accessKeyId,
  //     secretAccessKey,
  //     region,
  //     bucket,
  //   };
  // }
}
