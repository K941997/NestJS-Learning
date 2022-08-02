import request from 'supertest';
import { createDefaultVideo } from './utils/videos-admin.util';

describe('Videos Client Module', () => {
  describe('feature get video details', () => {
    it.each`
      id      | status | boolean
      ${1}    | ${400} | ${false}
      ${null} | ${400} | ${true}
    `(
      'get video details with id: $id, status: $status, boolean: $boolean',
      async ({ id, status, boolean }) => {
        if (boolean)
          return request(app.getHttpServer())
            .get(`/client/videos/${id}`)
            .send()
            .expect(status);

        const res = await request(app.getHttpServer())
          .get('/client/videos')
          .send();

        expect(res.statusCode).not.toBe(status);
      },
    );

    it('should get video details success', async () => {
      const video = await createDefaultVideo();
      return request(app.getHttpServer())
        .get(`/client/videos/${video.id}`)
        .send()
        .expect(200);
    });
  });
});
