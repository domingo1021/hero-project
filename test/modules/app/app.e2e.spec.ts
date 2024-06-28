import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '#app/app.module';

describe('AppController (e2e)', () => {
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

  it('/health', () => {
    return request(server).get('/health').expect(200).expect('OK');
  });

  it('/not-found, throw 404 if no route match.', () => {
    return request(server).get('/not-found').expect(404);
  });
});
