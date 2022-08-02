import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  BooleanEnum,
  LangEnum,
} from '../../../common/constants/global.constant';
import { Topic } from '../../entities/topic.entity';

export const createTopic = async (
  key: string,
  lang: LangEnum = LangEnum.En,
) => {
  const { body } = await request(app.getHttpServer())
    .post('/admin/topics')
    .send({
      key,
      description: 'description',
      enabled: BooleanEnum.TRUE,
      name: key,
      lang,
    });
  return body as Topic;
};

export const createDefaultTopics = async () => {
  return Promise.all(defaultTopicKeys.map((item) => createTopic(item)));
};
