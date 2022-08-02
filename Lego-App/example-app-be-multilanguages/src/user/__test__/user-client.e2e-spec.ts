import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { Audio } from '../../audio/entities/audio.entity';
import { createDefaultLevel } from '../../level/__test__/utils/helper.util';
import { getDefaultUser, seedDefaultUser } from '../../test/utils/auth.util';
import { getDbConnection } from '../../test/utils/helper.util';
import { createDefaultTopics } from '../../topic/__test__/utils/helper.util';
import { Videos } from '../../videos/entities/videos.entity';
import { createDefaultVideo } from '../../videos/__test__/utils/videos-admin.util';
import { User } from '../entities/user.entity';

describe('User Client Module', () => {
  describe('feature choose level topic', () => {
    it.each`
      levelKey           | topicKeys           | status | boolean
      ${defaultLevelKey} | ${defaultTopicKeys} | ${400} | ${false}
      ${undefined}       | ${defaultTopicKeys} | ${400} | ${true}
      ${defaultLevelKey} | ${undefined}        | ${400} | ${true}
    `(
      'user choose level and topics with: levelKey: $levelKey, topicKeys: $topicKeys, status: $status, boolean: $boolean',
      async ({ levelKey, topicKeys, status, boolean }) => {
        await Promise.all([
          createDefaultTopics(),
          createDefaultLevel(),
          seedDefaultUser(),
        ]);

        const res = await request(app.getHttpServer())
          .post('/client/choose-level-topics')
          .send({ topicKeys, levelKey });

        if (boolean) expect(res.status).toBe(status);
        else expect(res.status).not.toBe(status);
      },
    );
  });

  describe('feature choose level', () => {
    it.each`
      levelKey           | status | boolean
      ${defaultLevelKey} | ${400} | ${false}
      ${undefined}       | ${400} | ${true}
    `(
      'user choose level with: levelKey: $levelKey, status: $status, boolean: $boolean',
      async ({ levelKey, status, boolean }) => {
        await Promise.all([createDefaultLevel(), seedDefaultUser()]);

        const res = await request(app.getHttpServer())
          .post('/client/choose-level')
          .send({ levelKey });

        if (boolean) expect(res.status).toBe(status);
        else expect(res.status).not.toBe(status);
      },
    );

    it('should choose level if provide valid input', async () => {
      await Promise.all([createDefaultLevel(), seedDefaultUser()]);

      await request(app.getHttpServer())
        .post(`/client/choose-level`)
        .send({ levelKey: defaultLevelKey })
        .expect(200);
      const user = await getDefaultUser();

      expect(user.levelKey).toBe(defaultLevelKey);
    });
  });

  describe('feature choose topics', () => {
    it.each`
      topicKeys           | status | boolean
      ${defaultTopicKeys} | ${400} | ${false}
      ${[]}               | ${400} | ${true}
      ${undefined}        | ${400} | ${true}
    `(
      'user choose topics with: topicKeys: $topicKeys, status: $status, boolean: $boolean',
      async ({ topicKeys, status, boolean }) => {
        await Promise.all([createDefaultTopics(), seedDefaultUser()]);

        const res = await request(app.getHttpServer())
          .post('/client/choose-topics')
          .send({ topicKeys });

        if (boolean) expect(res.status).toBe(status);
        else expect(res.status).not.toBe(status);
      },
    );

    it('should choose topics if provide valid input', async () => {
      await Promise.all([createDefaultTopics(), seedDefaultUser()]);

      await request(app.getHttpServer())
        .post(`/client/choose-topics`)
        .send({ topicKeys: defaultTopicKeys })
        .expect(200);
      const user = await getDefaultUser();

      expect(user.userToTopics.map((item) => item.topicKey).sort()).toEqual(
        defaultTopicKeys.sort(),
      );
    });
  });

  describe('feature get relevant contents', () => {
    it('should get relevant contents success', async () => {
      global.defaultUser = {
        id: defaultUserId,
        firId: uuidv4(),
        levelKey: defaultLevelKey,
      };

      const video = await createDefaultVideo();

      const con = await getDbConnection();
      const user = await con.getRepository(User).save({
        firId: uuidv4(),
        levelKey: defaultLevelKey,
        userToTopics: defaultTopicKeys.map((item) => ({
          topicKey: item,
        })),
      });

      const { body } = (await request(app.getHttpServer())
        .get(`/client/relevant-contents`)
        .send()
        .expect(200)) as { body: { videos: Videos[]; audios: Audio[] } };

      expect(body.videos[0].id).toBe(video.id);
    });
  });
});
