import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { createDefaultLevel } from '../../../level/__test__/utils/helper.util';
import { getDbConnection } from '../../../test/utils/helper.util';
import { createDefaultTopics } from '../../../topic/__test__/utils/helper.util';
import { VideoTypes } from '../../entities/video-types.entity';
import { Videos } from '../../entities/videos.entity';
import { VideoTypeKey } from '../../enums/video-type-key.enum';

export const createDefaultVideoTypes = async () => {
  const con = await getDbConnection();

  await Promise.all(
    Object.values(VideoTypeKey).map((item) =>
      con.getRepository(VideoTypes).save({
        key: item,
        desc: 'description',
      }),
    ),
  );
};

export const createDefaultVideo = async () => {
  await Promise.all([
    createDefaultLevel(),
    createDefaultTopics(),
    createDefaultVideoTypes(),
  ]);

  const { body } = await request(app.getHttpServer())
    .post('/admin/videos')
    .send({
      videoUrl: youtubeUrl,
      name: 'test',
      desc: 'test',
      levelKey: defaultLevelKey,
      topicKeys: defaultTopicKeys,
      transcripts: [
        {
          highlightWords: ['1-byte character code'],
          duration: 2000,
          offset: 2000,
          text: 'word 1 2 3 4',
        },
        {
          highlightWords: ['A-D'],
          duration: 2000,
          offset: 2000,
          text: '5 6 7 8 olala loa loa',
        },
      ],
    })
    .expect(201);

  return body as Videos;
};
