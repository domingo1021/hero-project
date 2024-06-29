import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { asyncScheduler, scheduled, throwError } from 'rxjs';

import { ExternalHttpService } from '#http/http.service';
import { mockAxiosError } from '#test/mocks';

describe('ExternalHttpService', () => {
  let service: ExternalHttpService;
  let spyHttpServiceGet: jest.SpyInstance;

  beforeEach(async () => {
    spyHttpServiceGet = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalHttpService,
        {
          provide: HttpService,
          useValue: {
            get: spyHttpServiceGet,
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
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled([{ data: heroes }], asyncScheduler),
      );

      await expect(service.getHeroes()).resolves.toEqual(heroes);
    });

    it('should throw InternalServerErrorException if response format is invalid', async () => {
      const invalidResponse = [
        { id: '1', name: 'Hero A' }, // Missing 'image' property
        { id: '2', name: 'Hero B', image: 'http://hahow.com/image1.jpg' },
      ];
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled([{ data: invalidResponse }], asyncScheduler),
      );

      await expect(service.getHeroes()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if there is a server error', async () => {
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled(
          throwError(() => mockAxiosError),
          asyncScheduler,
        ),
      );

      await expect(service.getHeroes()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
