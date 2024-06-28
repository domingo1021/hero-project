import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';

import { Hero } from '#hero/dto';
import { AppModule } from '#app/app.module';
import { CustomErrorCodes } from '#src/cores/types';
import { mockAxiosError } from '#test/mocks';

describe('AppController (e2e)', () => {
  const UUID_V4_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const INT_REGEX = /^-?\d+$/;
  const ALPHABET_REGEX = /^[a-zA-Z ]+$/;
  const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
  let app: INestApplication;
  let server: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  afterEach(async () => {
    await app.close();
    nock.cleanAll();
  });

  describe('GET Heroes List heroes', () => {
    const baseUrl = 'https://hahow-recruit.herokuapp.com';
    const endpoint = '/heroes';

    it('/heroes, return 200 and an array of heroes.', () => {
      nock(baseUrl)
        .get(endpoint)
        .reply(200, [
          {
            id: '1',
            name: 'Hero',
            image: 'https://hahow-recruit.herokuapp.com/image1.jpg',
          },
          {
            id: '2',
            name: 'Iron Man',
            image: 'https://hahow-recruit.herokuapp.com/image2.jpg',
          },
        ]);

      return request(server)
        .get('/heroes')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('heroes');
          expect(Array.isArray(res.body.heroes)).toBe(true);

          const heroes: Array<Hero> = res.body.heroes;
          heroes.forEach((hero: Hero) => {
            expect(hero).toHaveProperty('id');
            expect(hero).toHaveProperty('name');
            expect(hero).toHaveProperty('image');
            expect(hero.id).toMatch(INT_REGEX);
            expect(hero.name).toMatch(ALPHABET_REGEX);
            expect(hero.image).toMatch(URL_REGEX);
          });
        });
    });

    it("/heroes, return 500 if there's a server error.", () => {
      nock(baseUrl).get(endpoint).reply(500, mockAxiosError);

      return request(server)
        .get('/heroes')
        .expect(500)
        .expect((res) => {
          expect(res.body.code).toBe(CustomErrorCodes.THIRDPARTY_SERVER_ERROR);
          expect(res.body.message).toBeDefined();
          expect(res.body.requestId).toMatch(UUID_V4_REGEX);
        });
    });

    it('/heroes, return 500 if response format is invalid.', () => {
      nock(baseUrl)
        .get(endpoint)
        .reply(200, [{ id: '1', name: 'Hero' }]);

      return request(server).get('/heroes').expect(500);
    });
  });

  describe('Get Single Hero', () => {
    const baseUrl = 'https://hahow-recruit.herokuapp.com';
    const endpoint = '/heroes/1';

    it('/heroes/:id, return 200 and a hero.', () => {
      nock(baseUrl).get(endpoint).reply(200, {
        id: '1',
        name: 'Hero',
        image: 'https://hahow-recruit.herokuapp.com/image1.jpg',
      });

      return request(server)
        .get('/heroes/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('image');
          expect(res.body.id).toMatch(INT_REGEX);
          expect(res.body.name).toMatch(ALPHABET_REGEX);
          expect(res.body.image).toMatch(URL_REGEX);
        });
    });

    it("/heroes/:id, return 500 if there's a server error.", () => {
      nock(baseUrl).get(endpoint).reply(500, mockAxiosError);

      return request(server)
        .get('/heroes/1')
        .expect(500)
        .expect((res) => {
          expect(res.body.code).toBe(CustomErrorCodes.THIRDPARTY_SERVER_ERROR);
          expect(res.body.message).toBeDefined();
          expect(res.body.requestId).toMatch(UUID_V4_REGEX);
        });
    });

    it('/heroes/:id, return 500 if response format is invalid.', () => {
      nock(baseUrl)
        .get(endpoint)
        .reply(200, { code: 1000, message: 'Backend error' });

      return request(server)
        .get('/heroes/1')
        .expect(500)
        .expect((res) => {
          expect(res.body.code).toBe(
            CustomErrorCodes.THIRDPARTY_API_RESPONSE_MISMATCH,
          );
          expect(res.body.message).toBeDefined();
          expect(res.body.requestId).toMatch(UUID_V4_REGEX);
        });
    });
  });
});
