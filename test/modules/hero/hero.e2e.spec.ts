import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { HeroModule } from '#hero/hero.module';
import { Hero } from '#hero/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HeroModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  it('/heroes, return 200 and an array of heroes.', () => {
    const INT_REGEX = /^-?\d+$/;
    const ALPHABET_REGEX = /^[a-zA-Z ]+$/;
    const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

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
});
