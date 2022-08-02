import request from 'supertest';
import { createDefaultLevel } from '../../level/__test__/utils/helper.util';
import { createDefaultTopics } from '../../topic/__test__/utils/helper.util';
import { VideoTypeKey } from '../enums/video-type-key.enum';
import { getVideoYoutubeId } from '../utils/helper.util';
import {
  createDefaultVideo,
  createDefaultVideoTypes,
} from './utils/videos-admin.util';

describe('Videos Admin Module', () => {
  describe('feature get and search videos list', () => {
    it.each`
      page         | limit        | search       | status | boolean
      ${undefined} | ${undefined} | ${undefined} | ${400} | ${false}
      ${1}         | ${10}        | ${'search'}  | ${400} | ${false}
      ${-1}        | ${10}        | ${'search'}  | ${400} | ${true}
      ${1}         | ${-10}       | ${'search'}  | ${400} | ${true}
    `(
      'get videos list with page: $page, limit: $limit, search: $search, expect: $boolean $status',
      async ({ page, limit, search, status, boolean }) => {
        const res = await request(app.getHttpServer())
          .get('/admin/videos')
          .query({ page, limit, search })
          .send();

        if (boolean) expect(res.status).toBe(status);
        else expect(res.status).not.toBe(status);
      },
    );
  });

  describe('feature transcript', () => {
    it('should return 200 and get transcript success if provide valid youtube url', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/admin/videos/transcript`)
        .query({ url: youtubeUrl, videoType: VideoTypeKey.YOUTUBE })
        .send()
        .expect(200);
      expect(body?.length).toBeGreaterThan(0);
    });

    it('should return 400 if not provide youtube url', async () => {
      return request(app.getHttpServer())
        .get(`/admin/videos/transcript`)
        .send()
        .expect(400);
    });

    it('should return 422 if provide invalid youtube url', async () => {
      return request(app.getHttpServer())
        .get(`/admin/videos/transcript`)
        .query({
          url: `${wrongYoutubeUrl}`,
          videoType: VideoTypeKey.YOUTUBE,
        })
        .send()
        .expect(422);
    });
  });

  describe('feature create video', () => {
    it.each`
      videoUrl      | name         | desc         | levelKey           | topicKeys           | transcripts     | status | boolean
      ${youtubeUrl} | ${'test'}    | ${'test'}    | ${defaultLevelKey} | ${defaultTopicKeys} | ${[transcript]} | ${400} | ${false}
      ${undefined}  | ${'test'}    | ${'test'}    | ${defaultLevelKey} | ${defaultTopicKeys} | ${[transcript]} | ${400} | ${true}
      ${youtubeUrl} | ${undefined} | ${'test'}    | ${defaultLevelKey} | ${defaultTopicKeys} | ${[transcript]} | ${400} | ${true}
      ${youtubeUrl} | ${'test'}    | ${undefined} | ${defaultLevelKey} | ${defaultTopicKeys} | ${[transcript]} | ${400} | ${true}
      ${youtubeUrl} | ${'test'}    | ${'test'}    | ${undefined}       | ${defaultTopicKeys} | ${[transcript]} | ${400} | ${true}
      ${youtubeUrl} | ${'test'}    | ${'test'}    | ${defaultLevelKey} | ${undefined}        | ${[transcript]} | ${400} | ${true}
      ${youtubeUrl} | ${'test'}    | ${'test'}    | ${defaultLevelKey} | ${defaultTopicKeys} | ${undefined}    | ${400} | ${true}
    `(
      'create video with videoUrl: $videoUrl, name: $name, desc: $desc, levelKey: $levelKey, topicKeys: $topicKeys, transcripts: $transcripts, status: $status, boolean: $boolean',
      async ({
        videoUrl,
        name,
        desc,
        levelKey,
        topicKeys,
        transcripts,
        status,
        boolean,
      }) => {
        await Promise.all([
          createDefaultLevel(),
          createDefaultTopics(),
          createDefaultVideoTypes(),
        ]);
        const res = await request(app.getHttpServer())
          .post('/admin/videos')
          .send({
            videoUrl,
            name,
            desc,
            levelKey,
            topicKeys,
            transcripts,
            status,
            boolean,
          });
        if (boolean) return expect(res.status).toBe(status);
        return expect(res.status).not.toBe(status);
      },
    );

    it('should create video success if provide valid input ', async () => {
      const video = await createDefaultVideo();
      expect(video.videoCode).toBe(getVideoYoutubeId(youtubeUrl));
    });
  });
});
