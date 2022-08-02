import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from '../ormconfig';
// import { TypeOrmExModule } from './typeorm-repository/typeorm-ex.module';
import { ProductEntity } from './product/entities/product.entity';
import { ThemeModule } from './theme/theme.module';
import { SearchModule } from './search/search.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [],
      synchronize: false,
      autoLoadEntities: true,
      logging: false,
    }),
    // TypeOrmExModule.forCustomRepository([ProductEntity]),
    ProductModule,
    CategoryModule,
    ThemeModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
