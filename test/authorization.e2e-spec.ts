import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HttpModule } from '../src/http.module.js';
import { faker } from '@faker-js/faker';

describe('AuthorizationController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/authorize (GET)', () => {
    it('should contain a "success" message if the request contain a code query param', async () => {
      const response = await request(app.getHttpServer())
        .get('/authorize')
        .query({ code: faker.random.alphaNumeric(260, { casing: 'mixed' }) });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.text).toMatch(/success/i);
    });

    it(`should contain a "failed" message if the request doesn't contain a code query param`, async () => {
      const response = await request(app.getHttpServer()).get('/authorize');

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.text).toMatch(/failed/i);
    });

    it('should be able to show a message from an error query param if available', async () => {
      const error = faker.lorem.sentences();
      const response = await request(app.getHttpServer())
        .get('/authorize')
        .query({ error });

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.text).toBe(error);
    });
  });
});
