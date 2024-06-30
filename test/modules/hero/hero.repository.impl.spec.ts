import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { CacheService } from '#cache/cache.service';
import { ExternalHttpService } from '#http/http.service';
import { HeroRepositoryImpl } from '#hero/hero.repository.impl';

describe('HeroRepositoryImpl', () => {
  let repository: HeroRepositoryImpl;

  let spyCacheGet: jest.SpyInstance;
  let spyCacheSet: jest.SpyInstance;

  let spyGetHeroes: jest.SpyInstance;
  let spyGetHeroById: jest.SpyInstance;
  let spyGetHeroProfileById: jest.SpyInstance;

  beforeEach(async () => {
    spyCacheGet = jest.fn();
    spyCacheSet = jest.fn();

    spyGetHeroes = jest.fn();
    spyGetHeroById = jest.fn();
    spyGetHeroProfileById = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeroRepositoryImpl,
        {
          provide: CacheService,
          useValue: {
            get: spyCacheGet,
            set: spyCacheSet,
          },
        },
        {
          provide: ExternalHttpService,
          useValue: {
            getHeroes: spyGetHeroes,
            getHeroById: spyGetHeroById,
            getHeroProfileById: spyGetHeroProfileById,
          },
        },
      ],
    }).compile();

    repository = module.get<HeroRepositoryImpl>(HeroRepositoryImpl);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('getAllHeroes', () => {
    it('should return an array of heroes from cache if available', async () => {
      const cachedHeroes = '[{"id":"1","name":"Hero A","image":"http://hahow.com/image1.jpg"}]';
      spyCacheGet.mockResolvedValueOnce(cachedHeroes);

      const result = await repository.getAllHeroes();

      expect(result).toEqual(JSON.parse(cachedHeroes));
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroes).not.toHaveBeenCalled();
      expect(spyCacheSet).not.toHaveBeenCalled();
    });

    it('should return an array of heroes from external API and cache the result', async () => {
      const heroes = [
        { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg' },
        { id: '2', name: 'Hero B', image: 'http://hahow.com/image2.jpg' },
      ];
      spyCacheGet.mockResolvedValueOnce(null);
      spyGetHeroes.mockResolvedValueOnce(heroes);
      spyCacheSet.mockResolvedValueOnce(undefined);

      const result = await repository.getAllHeroes();

      expect(result).toEqual(heroes);
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroes).toHaveBeenCalled();
      expect(spyCacheSet).toHaveBeenCalled();
    });

    it('should throw Error if an error occurs', async () => {
      spyCacheGet.mockRejectedValueOnce(new Error('Cache error'));

      await expect(repository.getAllHeroes()).rejects.toThrow(Error);
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroes).not.toHaveBeenCalled();
      expect(spyCacheSet).not.toHaveBeenCalled();
    });
  });

  describe('getAllHeroesWithProfile', () => {
    it('should return an array of heroes with profile from cache if available', async () => {
      const cachedHeroes =
        '[{"id":"1","name":"Hero A","image":"http://hahow.com/image1.jpg","profile":{"str":1,"int":1,"agi":1,"luk":1}}]';
      spyCacheGet.mockResolvedValueOnce(cachedHeroes);

      const result = await repository.getAllHeroesWithProfile();

      expect(result).toEqual(JSON.parse(cachedHeroes));
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroes).not.toHaveBeenCalled();
      expect(spyGetHeroProfileById).not.toHaveBeenCalled();
      expect(spyCacheSet).not.toHaveBeenCalled();
    });

    it('should return an array of heroes with profile from external API and cache the result', async () => {
      const heroes = [
        { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg' },
        { id: '2', name: 'Hero B', image: 'http://hahow.com/image2.jpg' },
      ];
      const profiles = [
        { str: 1, int: 1, agi: 1, luk: 1 },
        { str: 2, int: 2, agi: 2, luk: 2 },
      ];
      spyCacheGet.mockResolvedValueOnce(null);
      spyGetHeroes.mockResolvedValueOnce(heroes);
      spyGetHeroProfileById.mockResolvedValueOnce(profiles[0]).mockResolvedValueOnce(profiles[1]);
      spyCacheSet.mockResolvedValueOnce(undefined);

      const result = await repository.getAllHeroesWithProfile();

      expect(result).toEqual(heroes.map((hero, index) => ({ ...hero, profile: profiles[index] })));
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroes).toHaveBeenCalled();
      expect(spyGetHeroProfileById).toHaveBeenCalledTimes(2);
      expect(spyCacheSet).toHaveBeenCalled();
    });
  });

  describe('getHeroById', () => {
    it('should return a hero from cache if available', async () => {
      const cachedHero = '{"id":"1","name":"Hero A","image":"http://hahow.com/image1.jpg"}';
      spyCacheGet.mockResolvedValueOnce(cachedHero);

      const result = await repository.getHeroById('1');

      expect(result).toEqual(JSON.parse(cachedHero));
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroById).not.toHaveBeenCalled();
      expect(spyCacheSet).not.toHaveBeenCalled();
    });

    it('should return a hero from external API and cache the result', async () => {
      const hero = { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg' };
      spyCacheGet.mockResolvedValueOnce(null);
      spyGetHeroById.mockResolvedValueOnce(hero);
      spyCacheSet.mockResolvedValueOnce(undefined);

      const result = await repository.getHeroById('1');

      expect(result).toEqual(hero);
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroById).toHaveBeenCalled();
      expect(spyCacheSet).toHaveBeenCalled();
    });
  });

  describe('getHeroWithProfileById', () => {
    it('should return a hero with profile from cache if available', async () => {
      const cachedHero =
        '{"id":"1","name":"Hero A","image":"http://hahow.com/image1.jpg","profile":{"str":1,"int":1,"agi":1,"luk":1}}';
      spyCacheGet.mockResolvedValueOnce(cachedHero);

      const result = await repository.getHeroWithProfileById('1');

      expect(result).toEqual(JSON.parse(cachedHero));
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroById).not.toHaveBeenCalled();
      expect(spyGetHeroProfileById).not.toHaveBeenCalled();
      expect(spyCacheSet).not.toHaveBeenCalled();
    });

    it('should return a hero with profile from external API and cache the result', async () => {
      const hero = { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg' };
      const profile = { str: 1, int: 1, agi: 1, luk: 1 };
      spyCacheGet.mockResolvedValueOnce(null);
      spyGetHeroById.mockResolvedValueOnce(hero);
      spyGetHeroProfileById.mockResolvedValueOnce(profile);
      spyCacheSet.mockResolvedValueOnce(undefined);

      const result = await repository.getHeroWithProfileById('1');

      expect(result).toEqual({ ...hero, profile });
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroById).toHaveBeenCalled();
      expect(spyGetHeroProfileById).toHaveBeenCalled();
      expect(spyCacheSet).toHaveBeenCalled();
    });
  });

  describe('getHeroWithProfileById', () => {
    it('should return a hero profile from cache if available', async () => {
      const cachedProfile = '{"str":1,"int":2,"agi":3,"luk":4}';
      spyCacheGet.mockResolvedValueOnce(cachedProfile);

      const result = await repository.getHeroWithProfileById('1');

      expect(result).toEqual(JSON.parse(cachedProfile));
      expect(spyCacheGet).toHaveBeenCalled();
      expect(spyGetHeroProfileById).not.toHaveBeenCalled();
    });
    it('should return a hero profile from external API', async () => {
      const hero = { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg' };
      const profile = { str: 1, int: 2, agi: 3, luk: 4 };
      spyGetHeroById.mockResolvedValueOnce(hero);
      spyGetHeroProfileById.mockResolvedValueOnce(profile);

      const result = await repository.getHeroWithProfileById('1');

      expect(result).toEqual({ ...hero, profile });
      expect(spyGetHeroProfileById).toHaveBeenCalled();
    });
  });
});
