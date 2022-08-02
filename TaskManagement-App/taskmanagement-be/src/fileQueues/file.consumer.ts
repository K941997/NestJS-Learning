/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import * as fs from 'fs';

@Processor('file-operation')
export class FileConsumer{
    @Process('delete-file-job')
    async fileOperation(job: Job<unknown>){
        let value:any = job.data;
        await fs.unlinkSync(value.path);

        console.log(`${job.data} was deleted FileConsumer`)
    }
}