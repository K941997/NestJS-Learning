import request from 'supertest';

describe('File Module', () => {
  describe('feature create presigned url', () => {
    it('should return 500 if provide invalid file type', async () => {
      return request(app.getHttpServer())
        .post(`/file/presigned-url`)
        .send({ type: 'invalid' })
        .expect(500);
    });
  });
});
