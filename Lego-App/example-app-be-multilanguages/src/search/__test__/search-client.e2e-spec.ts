import { Pagination } from 'nestjs-typeorm-paginate';
import request from 'supertest';
import { getDefaultUser, seedDefaultUser } from '../../test/utils/auth.util';
import { createDefaultVideo } from '../../videos/__test__/utils/videos-admin.util';
import { SearchContentsResDto } from '../dtos/client/res/search-contents.res.dto';

describe('Search Client Module', () => {
  describe('feature search content', () => {
    it.each`
      keyword         | status | boolean
      ${'some thing'} | ${400} | ${false}
      ${''}           | ${400} | ${true}
      ${undefined}    | ${400} | ${true}
    `(
      'search content with: keyword: $keyword, status: $status, boolean: $boolean',
      async ({ keyword, status, boolean }) => {
        await seedDefaultUser();

        const res = await request(app.getHttpServer())
          .get('/client/search/contents')
          .query({ keyword })
          .send();

        if (boolean) expect(res.status).toBe(status);
        else expect(res.status).not.toBe(status);
      },
    );

    it('should search content if provide valid keyword and save search history', async () => {
      const [video] = await Promise.all([
        createDefaultVideo(),
        seedDefaultUser(),
      ]);

      const { body } = (await request(app.getHttpServer())
        .get('/client/search/contents')
        .query({ keyword: video.name })
        .expect(200)) as { body: Pagination<SearchContentsResDto> };

      expect(body.items[0].id).toBe(video.id);
      const user = await getDefaultUser();

      expect(user.userSearchs.map((item) => item.keyword)).toContain(
        video.name,
      );
    });

    it('should get search history success', async () => {});

    it('should delete search history success', async () => {});
  });
});
