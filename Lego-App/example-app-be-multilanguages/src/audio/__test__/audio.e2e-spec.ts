import request from 'supertest';

describe('Audio Module', () => {
  describe('feature get and search audios list', () => {
    it.each`
      page         | limit        | search       | topicKey          | levelKey        | status | boolean
      ${undefined} | ${undefined} | ${undefined} | ${undefined}      | ${undefined}    | ${400} | ${false}
      ${1}         | ${10}        | ${'search'}  | ${'test topic 1'} | ${'test level'} | ${400} | ${false}
      ${-1}        | ${10}        | ${'search'}  | ${'test topic 1'} | ${'test level'} | ${400} | ${true}
      ${1}         | ${-10}       | ${'search'}  | ${'test topic 1'} | ${'test level'} | ${400} | ${true}
    `(
      'get videos list with page: $page, limit: $limit, search: $search, topicKey: $topicKey, levelKey: $levelKey expect: $boolean $status',
      async ({ page, limit, search, topicKey, levelKey, status, boolean }) => {
        const res = await request(app.getHttpServer())
          .get('/audio')
          .query({ page, limit, search, topicKey, levelKey })
          .send();

        if (boolean) expect(res.status).toBe(status);
        else expect(res.status).not.toBe(status);
      },
    );
  });
});
