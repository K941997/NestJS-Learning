/* eslint-disable prettier/prettier */
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('message-queue')
export class MessageConsumer{ //!MessageConsumer Queues Bull
    @Process('message-job')
    messageJob(job: Job<unknown>){
        console.log(`${job.data} MessageConsumer`);
    }
}