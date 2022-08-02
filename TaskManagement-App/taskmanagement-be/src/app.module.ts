/* eslint-disable prettier/prettier */
import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'; //!.env

import { CategoriesModule } from './categories/categories.module';
import { PassportModule } from '@nestjs/passport'; //PassportJS for SignUp SignIn
import { CaslModule } from './casl/casl.module'; //CASL Role isCreator

import { MongooseModule } from '@nestjs/mongoose'; //MongoDB
import { CategoriesMongoDbModule } from './categories-mongo-db/categories-mongo-db.module';
import { RedisCacheModule } from './cacheRedis/redis.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { MessageProducerService } from './messageQueues/message.producer.service';
import { MessageConsumer } from './messageQueues/message.consumer';
import { FileProducerService } from './fileQueues/file.producer.service';
import { FileConsumer } from './fileQueues/file.consumer';
import { FirebaseAuthStrategy } from './firebase/firebase-auth.strategy';
import { ResourcesModule } from './firebase/resources/resources.module';

@Module({
  imports: [
    ConfigModule.forRoot({  //!.env Global
      isGlobal: true,
    }),

    TypeOrmModule.forRoot(), //!TypeOrm PostgreSQL Database

    AuthModule,

    TasksModule, //!TasksModule Chứa cả Cache (Nếu Cache bắt buộc ở AppModule thì ko được cho vào TasksModule)

    CategoriesModule,

    // CategoriesMongoDbModule,

    PassportModule.register({ //!SessionCookie PassportJS
      session: true,
    }),

    CaslModule, //!CASL Role isCreator

    // MongooseModule.forRoot(process.env.CONNECT_MONGODB, { //!MongoDB Database
    //   connectionName: 'categories', //connectionName ở categoriesMongo.module
    //   useNewUrlParser: true, //dùng để unique: true ở Schema
    //   useUnifiedTopology: true,
    //   autoIndex: true,
      
    // }),
    //.env CONNECT_MONGODB = mongodb+srv://Kay941997:password@taskmanagement.drrox.mongodb.net/myFirstDatabase?
  
    // MongooseModule.forRoot(process.env.CONNECT_MONGODB, {
    //   connectionName: 'tasks', //connectionName ở tasksMongo.module
    //   useNewUrlParser: true, //dùng để unique: true ở Schema
    //   useUnifiedTopology: true,
    //   autoIndex: true,
      
    // }), UserTypesModule //!MongoDB Database
    //.env CONNECT_MONGODB = mongodb+srv://Kay941997:password@taskmanagement.drrox.mongodb.net/myFirstDatabase?
    
    ScheduleModule.forRoot(), //!Task Scheduling

    BullModule.forRoot({ //!Queues Bull.forRoot (phải ở AppModule)
      redis: {  //Redis
        host: 'localhost',
        port: 6379
      }
    }),

    BullModule.registerQueue({ //!Queues Bull.registerQueue - nâng cao
      name: 'message-queue' //todo: MessageProducerService
    }, {
      name: 'file-operation' //todo: FileProducerService
    }),

    ResourcesModule, //!Test FE Firebase - nâng cao

  
  ],
  controllers: [AppController],
  providers: [
    AppService,
    
    MessageProducerService, //!Queues Bull - nâng cao
    MessageConsumer, //!Queues Bull - nâng cao
    FileProducerService, //!Queues Bull - nâng cao
    FileConsumer,  //!Queues Bull - nâng cao

    FirebaseAuthStrategy, //!Firebase - nâng cao
  ],
})
export class AppModule {}
