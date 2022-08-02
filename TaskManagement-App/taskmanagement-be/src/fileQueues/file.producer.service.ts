/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

@Injectable()
export class FileProducerService{
    constructor(@InjectQueue('file-operation') private queue: Queue) {
    }

    async deleteFileName(fileName: string) {
        let filePath = `D:/Image/Cyberpunk/${fileName}.jpg`
        await this.queue.add('delete-file-job', { 
            path:filePath
        }, {delay: 5000}); 
    }
}