import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as firebase from 'firebase-admin';

async function bootstrap() {
  firebase.initializeApp({
    credential: firebase.credential.cert({
      privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
    } as Partial<firebase.ServiceAccount>),
  });
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Headers, Accept-Language, lang',
    methods: 'GET,PUT,POST,DELETE,UPDATE,PATCH,OPTIONS,HEAD',
    credentials: true,
  });

  // Setup Swagger if NODE_ENV === development
  const config = new DocumentBuilder()
    .setTitle('Clevertube API')
    .setDescription('Clevertube API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('PORT', process.env.PORT);
  await app.listen(+process.env.PORT || 5000);
}
bootstrap();
