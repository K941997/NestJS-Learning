/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

import { initializeApp } from 'firebase-admin/app';
import { getAnalytics } from "firebase/analytics";
import * as admin from 'firebase-admin';

import * as dotenv from 'dotenv';
dotenv.config();

import * as hbs from 'hbs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {

  // admin.initializeApp({ //!Firebase:
  //   credential: admin.credential.cert({
  //     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  //     projectId: process.env.FIREBASE_PROJECT_ID,
  //   } as Partial<admin.ServiceAccount>),
  //   databaseURL: "https://nestjstaskmanagement-a7ecd-default-rtdb.firebaseio.com"
  // });
  

  const app = await NestFactory.create(AppModule, {
    //!NestExpressApplication cho hbs test Firebase
    // logger: false, //!Logger: (Log, console.log)
    // logger: ['error', 'warn'], //!Logger: (Log, console.log)
  });

  app.use(cookieParser()); //!Cookie: (for Refresh Token request?.cookies?.Refresh)
   
  app.setGlobalPrefix('api'); //!Thêm hậu tố api -> localhost:3000/api/

  //!Remove SessionCookie to Use Guard JWTToken return access_token = BearerToken check SessionCookie:
  // app.use(
  //   // cookieParser(),
  //   session({
  //     secret: "key session", //Bí mật Cho vào .env .gitignore
  //     resave: false,
  //     saveUninitialized: false, //Thay đổi session liên tục mỗi khi vào web
  //     cookie: {
  //       maxAge: 3600000,
  //     },
  //   }),
  // )
  // app.use(passport.initialize());
  // app.use(passport.session());

  //!Global ValidationPipe DTO:
  //Nếu ko để Global ValidationPipe thì trong Controller phải có ValidationPipe mới dùng được DTO
  //Nếu để Global ValidationPipe thì bắt buộc phải tạo DTO class-validator @IsNotEmpty
  app.useGlobalPipes(
    new ValidationPipe({
      // skipMissingProperties: true,
      whitelist: true,
    }),
  );

  // //!hbs (Test Frontend for Firebase):
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  // app.setViewEngine('hbs');
  // app.set('view options', { layout: 'main' });

  await app.listen(3000);
}
bootstrap();
