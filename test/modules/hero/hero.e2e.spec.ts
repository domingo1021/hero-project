import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import * as request from 'supertest';
import * as nock from 'nock';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';

import { CustomErrorCodes } from '#cores/types';
import { Hero } from '#hero/dto';
import { AppModule } from '#app/app.module';
import { HeroDataValidator } from '#hero/hero.validator';
import { CacheConfigModule } from '#cache/cache.module';
import {
  mockAuthApi,
  mockAxiosError,
  mockGetListHeroesApi,
  mockGetSingleHeroApi,
  mockGetSingleHeroProfileApi,
} from '#test/mocks';
import { ExternalHttpModule } from '#http/http.module';
import { ExternalHttpService } from '#http/http.service';

describe('AppController (e2e)', () => {
  const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const baseUrl = 'https://hahow-recruit.herokuapp.com';
  const authEndpoint = '/auth';

  let app: INestApplication;
  let server: any;
  let cacheManager: Cache;
  let httpApi: ExternalHttpService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CacheConfigModule, ExternalHttpModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
    cacheManager = moduleFixture.get<Cache>(CACHE_MANAGER);
    httpApi = moduleFixture.get<ExternalHttpService>(ExternalHttpService);
  });

  afterEach(async () => {
    await cacheManager.reset(); // Clear cache after each test
    await app.close();
    nock.cleanAll();
  });

  describe('GET Heroes List heroes', () => {
    const endpoint = '/heroes';

    describe('Without Auth', () => {
      it('/heroes, return 200 and an array of heroes.', () => {
        mockGetListHeroesApi();

        return request(server)
          .get('/heroes')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('heroes');
            expect(Array.isArray(res.body.heroes)).toBe(true);

            const heroes: Array<Hero> = res.body.heroes;
            heroes.forEach((hero: Hero) => {
              expect(HeroDataValidator.isHero(hero)).toBe(true);
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

    describe('With Auth', () => {
      it('/heroes, auth success, return 200 and an array of heroes with profiles.', () => {
        mockAuthApi();
        mockGetListHeroesApi();
        mockGetSingleHeroProfileApi();

        return request(server)
          .get('/heroes')
          .set('Username', 'hahow')
          .set('Password', 'rocks')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('heroes');
            expect(Array.isArray(res.body.heroes)).toBe(true);

            const heroes: Array<Hero> = res.body.heroes;
            heroes.forEach((hero: Hero) => {
              expect(HeroDataValidator.isHero(hero)).toBe(true);
              expect(HeroDataValidator.isHeroProfile(hero.profile)).toBe(true);
            });
          });
      });

      it('/heroes, auth failed, return 200 with array of heroes only', () => {
        mockAuthApi();
        mockGetListHeroesApi();
        nock(baseUrl).post(authEndpoint).reply(401, mockAxiosError);

        return request(server)
          .get('/heroes')
          .set('Username', 'hahow')
          .set('Password', 'wrongpassword')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('heroes');
            expect(Array.isArray(res.body.heroes)).toBe(true);

            const heroes: Array<Hero> = res.body.heroes;
            heroes.forEach((hero: Hero) => {
              expect(HeroDataValidator.isHero(hero)).toBe(true);
              expect(hero).not.toHaveProperty('profile');
            });
          });
      });

      it('/heroes, auth failed because of network error, return 200 with array of heroes only', () => {
        mockAuthApi();
        mockGetListHeroesApi();
        nock(baseUrl).post(authEndpoint).reply(500, mockAxiosError);

        return request(server)
          .get('/heroes')
          .set('Username', 'hahow')
          .set('Password', 'wrongpassword')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('heroes');
            expect(Array.isArray(res.body.heroes)).toBe(true);

            const heroes: Array<Hero> = res.body.heroes;
            heroes.forEach((hero: Hero) => {
              expect(HeroDataValidator.isHero(hero)).toBe(true);
              expect(hero).not.toHaveProperty('profile');
            });
          });
      });

      it('/heroes, auth skipped becuase authenticateion key mismtch, return 200 with array of heroes only', () => {
        mockGetListHeroesApi();

        return request(server)
          .get('/heroes')
          .set('Username', 'hahow')
          .set('pass', 'rocks')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('heroes');
            expect(Array.isArray(res.body.heroes)).toBe(true);

            const heroes: Array<Hero> = res.body.heroes;
            heroes.forEach((hero: Hero) => {
              expect(HeroDataValidator.isHero(hero)).toBe(true);
              expect(hero).not.toHaveProperty('profile');
            });
          });
      });
    });

    describe('Cached Heroes', () => {
      it('should call GET List Hero at first time, and get data from cache for second time', async () => {
        const spyGetHeroesApi = jest.spyOn(httpApi, 'getHeroes');
        const spyAuthApi = jest.spyOn(httpApi, 'authenticate');

        // first request to fetch heroes
        mockGetListHeroesApi();
        mockGetSingleHeroProfileApi();
        mockAuthApi();
        await request(server)
          .get('/heroes')
          .set('Username', 'hahow')
          .set('Password', 'rocks')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('heroes');
            expect(Array.isArray(res.body.heroes)).toBe(true);

            const heroes: Array<Hero> = res.body.heroes;
            heroes.forEach((hero: Hero) => {
              expect(HeroDataValidator.isHero(hero)).toBe(true);
              expect(HeroDataValidator.isHeroProfile(hero.profile)).toBe(true);
            });
          });
        expect(spyGetHeroesApi).toBeCalledTimes(1);
        expect(spyAuthApi).toBeCalledTimes(1);

        // second request to fetch heroes from cache
        await request(server)
          .get('/heroes')
          .set('Username', 'hahow')
          .set('Password', 'rocks')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('heroes');
            expect(Array.isArray(res.body.heroes)).toBe(true);

            const heroes: Array<Hero> = res.body.heroes;
            heroes.forEach((hero: Hero) => {
              expect(HeroDataValidator.isHero(hero)).toBe(true);
              expect(HeroDataValidator.isHeroProfile(hero.profile)).toBe(true);
            });
          });
        expect(spyGetHeroesApi).toBeCalledTimes(1);
        expect(spyAuthApi).toBeCalledTimes(1);
      });
    });
  });

  describe('Get Single Hero', () => {
    const endpoint = '/heroes/1';

    describe('Without Auth', () => {
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
            const hero = res.body;
            expect(HeroDataValidator.isHero(hero)).toBe(true);
          });
      });

      it('/heroes/:id, return 400 bad request if format of id is invalid', () => {
        return request(server)
          .get('/heroes/invalidId')
          .expect(400)
          .expect((res) => {
            expect(res.body.code).toBe(CustomErrorCodes.BAD_REQUEST);
            expect(res.body.message).toBeDefined();
            expect(res.body.requestId).toMatch(UUID_V4_REGEX);
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
        nock(baseUrl).get(endpoint).reply(200, { code: 1000, message: 'Backend error' });

        return request(server)
          .get('/heroes/1')
          .expect(500)
          .expect((res) => {
            expect(res.body.code).toBe(CustomErrorCodes.THIRDPARTY_API_RESPONSE_MISMATCH);
            expect(res.body.message).toBeDefined();
            expect(res.body.requestId).toMatch(UUID_V4_REGEX);
          });
      });

      it("/heroes/:id, return 404 if hero doesn't exist.", () => {
        nock(baseUrl)
          .get(endpoint)
          .reply(404, {
            message: 'Hero not found',
            name: 'Error',
            config: {},
            code: '404',
            request: {},
            response: { status: 404, statusText: 'Not Found' },
          } as AxiosError);

        return request(server)
          .get('/heroes/1')
          .expect(404)
          .expect((res) => {
            expect(res.body.code).toBe(CustomErrorCodes.HERO_NOT_FOUND);
            expect(res.body.message).toBeDefined();
            expect(res.body.requestId).toMatch(UUID_V4_REGEX);
          });
      });
    });

    describe('With Auth', () => {
      it('/heroes/:id, auth success, return 200 and a hero with profile.', () => {
        mockAuthApi();
        mockGetSingleHeroApi();
        mockGetSingleHeroProfileApi();

        return request(server)
          .get('/heroes/1')
          .set('Username', 'hahow')
          .set('Password', 'rocks')
          .expect(200)
          .expect((res) => {
            const hero = res.body;
            expect(HeroDataValidator.isHero(hero)).toBe(true);

            const profile = hero.profile;
            expect(HeroDataValidator.isHeroProfile(profile)).toBe(true);
          });
      });

      it('/heroes/:id, auth failed, return 200 with a hero only', () => {
        mockAuthApi();
        mockGetSingleHeroApi();
        nock(baseUrl).post(authEndpoint).reply(401, mockAxiosError);

        return request(server)
          .get('/heroes/1')
          .set('Username', 'hahow')
          .set('Password', 'wrongpassword')
          .expect(200)
          .expect((res) => {
            const hero = res.body;
            expect(HeroDataValidator.isHero(hero)).toBe(true);
            expect(hero).not.toHaveProperty('profile');
          });
      });

      it('/heroes/:id, auth failed because of network error, return 200 with a hero only', () => {
        mockAuthApi();
        mockGetSingleHeroApi();
        nock(baseUrl).post(authEndpoint).reply(500, mockAxiosError);

        return request(server)
          .get('/heroes/1')
          .set('Username', 'hahow')
          .set('Password', 'wrongpassword')
          .expect(200)
          .expect((res) => {
            const hero = res.body;
            expect(HeroDataValidator.isHero(hero)).toBe(true);
            expect(hero).not.toHaveProperty('profile');
          });
      });

      it('/heroes/:id, auth skipped becuase authenticateion key mismtch, return 200 with a hero only', () => {
        mockGetSingleHeroApi();

        return request(server)
          .get('/heroes/1')
          .set('Username', 'hahow')
          .set('pass', 'rocks')
          .expect(200)
          .expect((res) => {
            const hero = res.body;
            expect(HeroDataValidator.isHero(hero)).toBe(true);
            expect(hero).not.toHaveProperty('profile');
          });
      });
    });

    describe('Cached Heroes', () => {
      it('should call GET Single Hero at first time, and get data from cache for second time', async () => {
        const spyGetHeroApi = jest.spyOn(httpApi, 'getHeroById');
        const spyGetHeroProfileApi = jest.spyOn(httpApi, 'getHeroProfileById');
        const spyAuthApi = jest.spyOn(httpApi, 'authenticate');

        mockGetSingleHeroApi();
        mockGetSingleHeroProfileApi();
        mockAuthApi();

        // first request to fetch hero
        await request(server)
          .get('/heroes/1')
          .set('Username', 'hahow')
          .set('Password', 'rocks')
          .expect(200)
          .expect((res) => {
            const hero = res.body;
            console.log('hero', hero);
            expect(HeroDataValidator.isHero(hero)).toBe(true);
            expect(HeroDataValidator.isHeroProfile(hero.profile)).toBe(true);
          });

        expect(spyGetHeroApi).toBeCalledTimes(1);
        expect(spyGetHeroProfileApi).toBeCalledTimes(1);
        expect(spyAuthApi).toBeCalledTimes(1);

        // second request to fetch hero from cache
        await request(server)
          .get('/heroes/1')
          .expect(200)
          .set('Username', 'hahow')
          .set('Password', 'rocks')
          .expect((res) => {
            const hero = res.body;
            expect(HeroDataValidator.isHero(hero)).toBe(true);
            expect(HeroDataValidator.isHeroProfile(hero.profile)).toBe(true);
          });

        expect(spyGetHeroApi).toBeCalledTimes(1);
        expect(spyGetHeroProfileApi).toBeCalledTimes(1);
        expect(spyAuthApi).toBeCalledTimes(1);
      });
    });
  });
});
