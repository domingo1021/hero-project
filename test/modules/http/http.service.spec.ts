import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { asyncScheduler, scheduled, throwError } from 'rxjs';

import { ExternalHttpService } from '#http/http.service';
import { mockAxiosError } from '#test/mocks';

describe('ExternalHttpService', () => {
  let service: ExternalHttpService;
  let spyHttpServiceGet: jest.SpyInstance;
  let spyHttpServicePost: jest.SpyInstance;

  beforeEach(async () => {
    spyHttpServiceGet = jest.fn();
    spyHttpServicePost = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalHttpService,
        {
          provide: HttpService,
          useValue: {
            get: spyHttpServiceGet,
            post: spyHttpServicePost,
          },
        },
      ],
    }).compile();

    service = module.get<ExternalHttpService>(ExternalHttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('getHeroes', () => {
    it('should return an array of heroes', async () => {
      const heroes = [
        { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg' },
        { id: '2', name: 'Hero B', image: 'http://hahow.com/image2.jpg' },
      ];
      spyHttpServiceGet.mockReturnValueOnce(scheduled([{ data: heroes }], asyncScheduler));

      await expect(service.getHeroes()).resolves.toEqual(heroes);
    });

    it('should throw InternalServerErrorException if response format is invalid', async () => {
      const invalidResponse = [
        { id: '1', name: 'Hero A' }, // Missing 'image' property
        { id: '2', name: 'Hero B', image: 'http://hahow.com/image1.jpg' },
      ];
      spyHttpServiceGet.mockReturnValueOnce(scheduled([{ data: invalidResponse }], asyncScheduler));

      await expect(service.getHeroes()).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if there is a server error', async () => {
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled(
          throwError(() => mockAxiosError),
          asyncScheduler,
        ),
      );

      await expect(service.getHeroes()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getHeroById', () => {
    it('should return a hero', async () => {
      const hero = { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg' };
      spyHttpServiceGet.mockReturnValueOnce(scheduled([{ data: hero }], asyncScheduler));

      await expect(service.getHeroById('1')).resolves.toEqual(hero);
    });

    it('should throw InternalServerErrorException if response format is invalid', async () => {
      const invalidResponse = { id: '1', name: 'Hero A' }; // Missing 'image' property
      spyHttpServiceGet.mockReturnValueOnce(scheduled([{ data: invalidResponse }], asyncScheduler));

      await expect(service.getHeroById('1')).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if hero is not found', async () => {
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled(
          throwError(() => mockAxiosError),
          asyncScheduler,
        ),
      );

      await expect(service.getHeroById('1')).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw not found exception if hero is not found', async () => {
      const notFoundError = {
        response: {
          status: 404,
        },
      };
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled(
          throwError(() => notFoundError),
          asyncScheduler,
        ),
      );

      await expect(service.getHeroById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getHeroProfileById', () => {
    it('should return a hero profile', async () => {
      const profile = { str: 1, int: 2, agi: 3, luk: 4 };
      spyHttpServiceGet.mockReturnValueOnce(scheduled([{ data: profile }], asyncScheduler));

      await expect(service.getHeroProfileById('1')).resolves.toEqual(profile);
    });

    it('should throw InternalServerErrorException if response format is invalid', async () => {
      const invalidResponse = { str: 1, int: 2, agi: 3 }; // Missing 'luk' property
      spyHttpServiceGet.mockReturnValueOnce(scheduled([{ data: invalidResponse }], asyncScheduler));

      await expect(service.getHeroProfileById('1')).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if network error occur', async () => {
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled(
          throwError(() => mockAxiosError),
          asyncScheduler,
        ),
      );

      await expect(service.getHeroProfileById('1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('authenticate', () => {
    const username = 'username';
    const password = 'password';
    it('should return true if authentication is successful', async () => {
      const response = { data: {} };
      spyHttpServicePost.mockReturnValueOnce(scheduled([response], asyncScheduler));

      await expect(service.authenticate(username, password)).resolves.toEqual(true);
    });

    it('should return false if authentication is unsuccessful', async () => {
      spyHttpServicePost.mockImplementationOnce(() => throwError(() => mockAxiosError));

      await expect(service.authenticate(username, password)).resolves.toEqual(false);
    });
  });
});
