import { Inject, Injectable } from '@nestjs/common';

import { Hero, HeroRepository } from '#hero/dto';

@Injectable()
export class HeroService {
  constructor(@Inject('HeroRepository') private readonly heroRepo: HeroRepository) {}

  /**
   * @description Get all heroes with profile if authenticated, otherwise get all heroes only
   * @param {boolean} isAuthenticated - Flag to determine if hero profile should be fetched
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async findAll(isAuthenticated: boolean = false): Promise<Array<Hero>> {
    if (!isAuthenticated) return this.heroRepo.getAllHeroes();

    return this.heroRepo.getAllHeroesWithProfile();
  }

  /**
   * @description Get single heroes with profile if authenticated, otherwise get single heroes only
   * @param {string} id - Hero ID
   * @param {boolean} isAuthenticated - Flag to determine if hero profile should be fetched
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async findById(id: string, isAuthenticated: boolean = false): Promise<Hero> {
    if (!isAuthenticated) return this.heroRepo.getHeroById(id);

    return this.heroRepo.getHeroWithProfileById(id);
  }
}
