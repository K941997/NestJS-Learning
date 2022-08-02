import {
  GetTranscriptionJobCommand,
  GetTranscriptionJobCommandInput,
  ListTranscriptionJobsCommand,
  ListTranscriptionJobsCommandInput,
  StartTranscriptionJobCommand,
  StartTranscriptionJobCommandInput,
  TranscribeClient,
} from '@aws-sdk/client-transcribe';
import { Injectable } from '@nestjs/common';
import { ConfigGetOptions, ConfigService } from '@nestjs/config';
import { IGlobalConfig } from '../../common/config/global.config';
import { SupportFileType } from '../../common/constants/global.constant';
import { UuidService } from './uuid.service';

@Injectable()
export class AudioToTextService {
  constructor(
    private transcribeClient: TranscribeClient,
    private configService: ConfigService<IGlobalConfig>,
    private uuidService: UuidService,
  ) {
    const config = this.getConfig();
    this.transcribeClient = new TranscribeClient({ region: config.s3Region });
  }

  async createTranscribeJob(
    userId: number,
    url: string,
    audioCode: string,
    mediaFormat: SupportFileType,
  ) {
    const config = this.getConfig();
    const nameJob = `AUDIO-${audioCode}`;
    // Input is the id of the file, so we can validate it.
    const params: StartTranscriptionJobCommandInput = {
      TranscriptionJobName: nameJob,
      LanguageCode: 'en-US', // For example, 'en-US'
      MediaFormat: mediaFormat, // For example, 'wav'
      Media: {
        MediaFileUri: url,
      },
      OutputBucketName: config.s3Bucket, // add folder transcript to this bucket
      OutputKey: `transcripts/${userId}/${nameJob}.json`,
    };

    const data = await this.transcribeClient.send(
      new StartTranscriptionJobCommand(params),
    );

    console.log('Success - put', data);
    return data; // For unit tests.
  }

  async getDetailTranscribeJob() {
    const params: GetTranscriptionJobCommandInput = {
      TranscriptionJobName: 'JOB-7b2055a9-4610-44e7-935c-8c8f7be589ec',
      // job names containing this string
    };

    const data = await this.transcribeClient.send(
      new GetTranscriptionJobCommand(params),
    );
    return data; // For unit tests.
  }

  async getListTranscribeJob(jobNameContains: string) {
    const params: ListTranscriptionJobsCommandInput = {
      JobNameContains: jobNameContains, // Not required. Returns only transcription
      // job names containing this string
    };

    const data = await this.transcribeClient.send(
      new ListTranscriptionJobsCommand(params),
    );
    console.log('Success', data.TranscriptionJobSummaries);
    return data; // For unit tests.
  }

  private getConfig() {
    const option: ConfigGetOptions = {
      infer: true,
    };
    const accessKeyId = this.configService.get('s3.awsAccessKeyId', option);
    const secretAccessKey = this.configService.get(
      's3.awsSecretAccessKey',
      option,
    );
    const s3Region = this.configService.get('s3.awsS3Region', option);
    const s3Bucket = this.configService.get('s3.awsS3BucketName', option);
    return {
      accessKeyId,
      secretAccessKey,
      s3Region,
      s3Bucket,
    };
  }
}
