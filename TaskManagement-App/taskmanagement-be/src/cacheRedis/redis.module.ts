/* eslint-disable prettier/prettier */
import {
  Module,
  CacheModule,
  OnModuleInit,
  Inject,
  Logger,
  CACHE_MANAGER
} from '@nestjs/common';
import { RedisCacheService } from './redis.service';
import { Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store'

//!Redis Cache: (+ Docker)
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: 'localhost',
          port: 6379,
          ttl: 60 * 3600 * 1000
        }
      }
    })
  ],
  providers: [RedisCacheService],
  exports: [
    RedisCacheModule,
    RedisCacheService
  ],

})
export class RedisCacheModule implements OnModuleInit {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}
  public onModuleInit(): any{
    const logger = new Logger('Cache')
  }
}
