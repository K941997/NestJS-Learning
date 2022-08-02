import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Request } from 'express';
import { FirebaseAuthenGuard } from './auth/guard/firebase-authen.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() request: any): string {
    return `Success ${process.env.POSTGRES_HOST}`;
  }

  // @Get('wiki')
  // async getWiki(@Query('q') query: string): Promise<any> {
  //   return await this.appService.getWiki(query);
  // }

  // @Get('yt-transcript')
  // getYtTranscript(@Query('videoId') videoId: string) {
  //   return this.appService.getYtTranscript(videoId);
  // }

  // @Post('audio-transcript')
  // createAudioTranscript(@Query('url') url: string) {
  //   return this.appService.createAudioTranscript(url);
  // }

  // @Get('audio-transcript')
  // getListAudioTranscript() {
  //   return this.appService.getListTranscribeJob();
  // }

  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       url: {
  //         type: 'string',
  //       },
  //     },
  //   },
  // })
  // @Post('upload-image')
  // uploadFromUrl(@Body('url') url: string) {
  //   return this.appService.uploadFromUrl(url);
  // }

  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       type: {
  //         type: 'string',
  //       },
  //     },
  //   },
  // })
  // @Post('presign-url')
  // createPresignUrl(@Body('type') type: string) {
  //   return this.appService.createPresignUpload(type);
  // }
}
