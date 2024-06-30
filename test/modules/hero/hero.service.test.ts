import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { HeroService } from '#hero/hero.service';
import { HeroRepository } from '#hero/dto';

describe('HeroService', () => {
  let service: HeroService;
  let repository: HeroRepository;

  let spyGetAllHeroes: jest.SpyInstance;
  let spyGetAllHeroesWithProfile: jest.SpyInstance;
  let spyGetHeroById: jest.SpyInstance;
  let spyGetHeroWithProfileById: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeroService,
        {
          provide: 'HeroRepository',
          useValue: {
            getAllHeroes: spyGetAllHeroes,
            getAllHeroesWithProfile: spyGetAllHeroesWithProfile,
            getHeroById: spyGetHeroById,
            getHeroWithProfileById: spyGetHeroWithProfileById,
          },
        },
      ],
    }).compile();

    service = module.get<HeroService>(HeroService);
    repository = module.get<HeroRepository>('HeroRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return all heroes if not authenticated', async () => {
      const heroes = [
        { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg' },
        { id: '2', name: 'Hero B', image: 'http://hahow.com/image1.jpg' },
      ];
      spyGetAllHeroes.mockResolvedValueOnce(heroes);

      const result = await service.findAll(false);

      expect(result).toEqual(heroes);
      expect(repository.getAllHeroes).toHaveBeenCalled();
      expect(repository.getAllHeroesWithProfile).not.toHaveBeenCalled();
    });

    it('should return all heroes with profile if authenticated', async () => {
      const heroes = [
        { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg', profile: { str: 1, int: 1, agi: 1, luk: 1 } },
        { id: '2', name: 'Hero B', image: 'http://hahow.com/image1.jpg', profile: { str: 2, int: 2, agi: 2, luk: 2 } },
      ];
      spyGetAllHeroesWithProfile.mockResolvedValueOnce(heroes);

      const result = await service.findAll(true);

      expect(result).toEqual(heroes);
      expect(repository.getAllHeroes).not.toHaveBeenCalled();
      expect(repository.getAllHeroesWithProfile).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      spyGetAllHeroes.mockRejectedValueOnce(new Error('Repository error'));

      await expect(service.findAll(false)).rejects.toThrow(InternalServerErrorException);
      expect(repository.getAllHeroes).toHaveBeenCalled();
      expect(repository.getAllHeroesWithProfile).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a hero by ID if not authenticated', async () => {
      const hero = { id: '1', name: 'Hero A', image: 'http://hahow.com/image1.jpg' };
      spyGetHeroById.mockResolvedValueOnce(hero);

      const result = await service.findById('1', false);

      expect(result).toEqual(hero);
      expect(repository.getHeroById).toHaveBeenCalledWith('1');
      expect(repository.getHeroWithProfileById).not.toHaveBeenCalled();
    });

    it('should return a hero with profile by ID if authenticated', async () => {
      const hero = {
        id: '1',
        name: 'Hero A',
        image: 'http://hahow.com/image1.jpg',
        profile: { str: 1, int: 1, agi: 1, luk: 1 },
      };
      spyGetHeroWithProfileById.mockResolvedValueOnce(hero);

      const result = await service.findById('1', true);

      expect(result).toEqual(hero);
      expect(repository.getHeroById).not.toHaveBeenCalled();
      expect(repository.getHeroWithProfileById).toHaveBeenCalledWith('1');
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      spyGetHeroById.mockRejectedValueOnce(new Error('Repository error'));

      await expect(service.findById('1', false)).rejects.toThrow(InternalServerErrorException);
      expect(repository.getHeroById).toHaveBeenCalledWith('1');
      expect(repository.getHeroWithProfileById).not.toHaveBeenCalled();
    });
  });
});
