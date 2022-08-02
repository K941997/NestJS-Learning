/* eslint-disable prettier/prettier */
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

@Injectable()
export class MessageProducerService{ //!MessageProducerService Queues Bull
    constructor(@InjectQueue('message-queue') private queue: Queue) {
    }

    async sendMessage(msg: string) {
        await this.queue.add('message-job', {
            text: msg
        }, {delay: 5000})
    }
}