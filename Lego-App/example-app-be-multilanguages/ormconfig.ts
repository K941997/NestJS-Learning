import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// When run migration, app.module do not run, so we must load env manual
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

let dbConfig: TypeOrmModuleOptions & PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  // logging: true,
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    dbConfig = {
      ...dbConfig,
    };
    break;
  case 'test':
    dbConfig = {
      ...dbConfig,
      database: process.env.POSTGRES_DB_TEST,
      synchronize: true,
      autoLoadEntities: true,
      dropSchema: true,
      logging: false,
      extra: {
        connectionLimit: 1,
      },
    };
    break;

  default:
    // Default is development
    dbConfig = {
      ...dbConfig,
      migrationsRun: true,
      // logging: false,
    };
    break;
}

export default dbConfig;

// module.exports = dbConfig;
