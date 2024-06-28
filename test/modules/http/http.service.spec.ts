import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { asyncScheduler, scheduled, throwError } from 'rxjs';
import { AxiosError } from 'axios';

import { ExternalHttpService } from '#http/http.service';

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
        { id: '1', name: 'Hero 1', image: 'image1.jpg' },
        { id: '2', name: 'Hero 2', image: 'image2.jpg' },
      ];
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled([{ data: heroes }], asyncScheduler),
      );

      await expect(service.getHeroes()).resolves.toEqual(heroes);
    });

    it('should throw InternalServerErrorException if response format is invalid', async () => {
      const invalidResponse = [
        { id: '1', name: 'Hero 1' }, // Missing 'image' property
        { id: '2', name: 'Hero 2', image: 'image2.jpg' },
      ];
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled([{ data: invalidResponse }], asyncScheduler),
      );

      await expect(service.getHeroes()).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if there is a server error', async () => {
      const errorMessage = 'Internal Server Error';
      spyHttpServiceGet.mockReturnValueOnce(
        scheduled(
          throwError(
            () =>
              ({
                message: errorMessage,
                name: 'Error',
                config: {},
                code: '500',
                request: {},
                response: { status: 500, statusText: 'Internal Server Error' },
              }) as AxiosError,
          ),
          asyncScheduler,
        ),
      );

      await expect(service.getHeroes()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
