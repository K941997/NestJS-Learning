/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { FileProducerService } from './fileQueues/file.producer.service';
import { MessageProducerService } from './messageQueues/message.producer.service';

@Controller() //localhost:3000/api/
export class AppController {
  constructor(
    private readonly appService: AppService,
    private messageProducerService: MessageProducerService,
    private fileProducerService: FileProducerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  //!MessageProducerService Queues Bull:
  @Get('send-message') 
  async sendMessage(@Query('msg') msg: string) {
    this.messageProducerService.sendMessage(msg);
    return `${msg} AppController`;
  }

  //!FileProducerService Queues Bull:
  @Delete('delete-file-name') 
  async deleteFileName(@Query('fileName') fileName: string) {
    await this.fileProducerService.deleteFileName(fileName);
    return `${fileName} was deleted AppController`;
  }


  //!Test Frontend Firebase:
  @Get('login')
  @Render('login')
  login(){
    return;
  }

  @Get('signup')
  @Render('signup')
  signup(){
    return;
  }


}
