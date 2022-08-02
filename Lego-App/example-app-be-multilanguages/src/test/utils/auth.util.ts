import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../user/entities/user.entity';
import { getDbConnection } from './helper.util';

export const seedDefaultUser = async () => {
  const con = await getDbConnection();
  const user = await con.getRepository(User).save({
    firId: uuidv4(),
  });
  return user;
};

export const chooseLevelAndTopic = async () => {
  await Promise.all([
    request(app.getHttpServer())
      .post(`/client/choose-level`)
      .send({ levelKey: defaultLevelKey })
      .expect(200),
    request(app.getHttpServer())
      .post(`/client/choose-topics`)
      .send({ topicKeys: defaultTopicKeys })
      .expect(200),
  ]);
};

export const getDefaultUser = async () => {
  const con = await getDbConnection();
  return con
    .createQueryBuilder(User, 'user')
    .leftJoinAndSelect('user.level', 'level')
    .leftJoinAndSelect('user.userToTopics', 'userToTopics')
    .leftJoinAndSelect('user.userSearchs', 'userSearchs')
    .getOne();
};
