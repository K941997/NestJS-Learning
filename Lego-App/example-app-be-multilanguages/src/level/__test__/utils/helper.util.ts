import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  BooleanEnum,
  LangEnum,
} from '../../../common/constants/global.constant';
import { Level } from '../../entities/level.entity';

export const createLevel = async (
  key: string,
  lang: LangEnum = LangEnum.En,
) => {
  const { body } = await request(app.getHttpServer())
    .post('/admin/levels')
    .send({
      key,
      description: 'description',
      enabled: BooleanEnum.TRUE,
      name: key,
      lang,
    })
    .expect(201);
  return body as Level;
};

export const createDefaultLevel = async () => {
  return createLevel(defaultLevelKey);
};
