/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { CronJob } from 'cron';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  getHello(): string {
    return 'Hello World!';
  }

  //!Task Scheduling:
  //todo: Declarative cron jobs:
  @Cron('* * * * * *') 
  triggerCronJob(){
    // console.log("CronJob in Task Scheduling")
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  triggerCronJobExpression(){
    // console.log("CronJob Expression in Task Scheduling")
  }

  @Cron('4 * * * * *', {
    name: 'messaging',
    timeZone: 'America/New_York'
  })
  triggerCronJobOptions(){
    // console.log("CronJob Options in Task Scheduling")
  }

  //todo: Declarative intervals:
  @Interval(2000)
  triggerCronJobInterval(){
    // console.log("CronJob Interval in Task Scheduling")
  }

  @Interval('messaging', 3500)
  triggerCronJobIntervalOptions(){
    // console.log("CronJob Interval Options in Task Scheduling")
  }

  //todo: Declarative timeouts:
  @Timeout(3000)
  handleTimeout() {
    // console.log("Calling once after timeout of 3s")
  }

  @Timeout('messaging', 3500)
  handleNamedTimeout(){
    // console.log("Calling once after 3.5s based on named timeout")
  }
  

  //todo: Dynamic cron jobs:
  private readonly logger = new Logger(AuthService.name);
  
  @Cron('* * * * * *', {
    name: 'notifications',
  })

  triggerNotificationsDynamicCronJob(){
    // const job = this.schedulerRegistry.getCronJob('notifications');
    // job.stop();
    // // job.start();
    // console.log(job.lastDate())
  }

  addCronJob(name: string, seconds: string){
    // const job = new CronJob(`${seconds} * * * * *`, () => {
    //   this.logger.warn(`time (${seconds}) for job ${name} to run!`);
    // });
    
    // this.schedulerRegistry.addCronJob(name, job);
    // job.start();

    // this.logger.warn(
    //   `job ${name} added for each minute at ${seconds} seconds!`,
    // )
  }

  deleteCron(name: string) {
    // this.schedulerRegistry.deleteCronJob(name);
    // this.logger.warn(`job ${name} deleted!`);
  }

  getCrons() {
    // const jobs = this.schedulerRegistry.getCronJobs();
    // jobs.forEach((value, key, map) => {
    //   let next;
    //   try {
    //     next = value.nextDates().toJSDate();
    //   } catch (e) {
    //     next = 'error: next fire date is in the past!';
    //   }
    //   this.logger.log(`job: ${key} -> next: ${next}`);
    // });
  }

  //todo: Dynamic intervals:
  triggerNotificationsDynamicIntervals(){
    // const interval = this.schedulerRegistry.getInterval('notifications');
    // clearInterval(interval);
  }
  

  addInterval(name: string, milliseconds: number) {
    // const callback = () => {
    //   this.logger.warn(`Interval ${name} executing at time (${milliseconds})!`);
    // };
  
    // const interval = setInterval(callback, milliseconds);
    // this.schedulerRegistry.addInterval(name, interval);
  }

  deleteInterval(name: string) {
    // this.schedulerRegistry.deleteInterval(name);
    // this.logger.warn(`Interval ${name} deleted!`);
  }

  getIntervals() {
    // const intervals = this.schedulerRegistry.getIntervals();
    // intervals.forEach(key => this.logger.log(`Interval: ${key}`));
  }

  
  //todo: Dynamic timeouts:
  triggerNotificationsDynamicTimeout(){
    // const timeout = this.schedulerRegistry.getTimeout('notifications');
    // clearTimeout(timeout);
  }

  addTimeout(name: string, milliseconds: number) {
    // const callback = () => {
    //   this.logger.warn(`Timeout ${name} executing after (${milliseconds})!`);
    // };
  
    // const timeout = setTimeout(callback, milliseconds);
    // this.schedulerRegistry.addTimeout(name, timeout);
  }

  deleteTimeout(name: string) {
    // this.schedulerRegistry.deleteTimeout(name);
    // this.logger.warn(`Timeout ${name} deleted!`);
  }
  
  getTimeouts() {
    // const timeouts = this.schedulerRegistry.getTimeouts();
    // timeouts.forEach(key => this.logger.log(`Timeout: ${key}`));
  }
  
 
  

  

}
