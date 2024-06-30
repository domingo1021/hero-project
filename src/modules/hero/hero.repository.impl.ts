import { Injectable } from '@nestjs/common';

import { CacheService } from '#cache/cache.service';
import { ExternalHttpService } from '#http/http.service';
import { Hero, HeroRepository } from '#hero/dto';

@Injectable()
export class HeroRepositoryImpl implements HeroRepository {
  private readonly GET_ALL_HEROES_KEY = 'heroes';
  private readonly GET_ALL_HEROES_WITH_PROFILE_KEY = 'heroes_with_profile';
  private readonly GET_HERO_BY_ID_KEY = 'hero_'; // hero_{id}
  private readonly GET_HERO_WITH_PROFILE_BY_ID_KEY = 'hero_with_profile_'; // hero_with_profile_{id}

  constructor(
    private readonly cacheService: CacheService,
    private readonly httpApi: ExternalHttpService,
  ) {}

  /**
   * @description Get all heroes in cache-aside strategy: get cache first, if not exist, fetch from external API.
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async getAllHeroes(): Promise<Array<Hero>> {
    const cachedHeroes = await this.cacheService.get<string>(this.GET_ALL_HEROES_KEY);
    if (cachedHeroes) {
      return JSON.parse(cachedHeroes);
    }

    const heroes: Array<Hero> = await this.httpApi.getHeroes();
    await this.cacheService.set(this.GET_ALL_HEROES_KEY, JSON.stringify(heroes));

    return heroes;
  }

  /**
   * @description Get all heroes in cache-aside strategy: get cache first, if not exist, fetch from external API.
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async getAllHeroesWithProfile(): Promise<Array<Hero>> {
    const cachedHeroes = await this.cacheService.get<string>(this.GET_ALL_HEROES_WITH_PROFILE_KEY);
    if (cachedHeroes) {
      return JSON.parse(cachedHeroes);
    }

    const heroes: Array<Hero> = await this.httpApi.getHeroes();
    await Promise.all(
      heroes.map(async (hero) => {
        const profile = await this.httpApi.getHeroProfileById(hero.id);
        hero.profile = profile;
      }),
    );
    await this.cacheService.set(this.GET_ALL_HEROES_WITH_PROFILE_KEY, JSON.stringify(heroes));

    return heroes;
  }

  /**
   * @description Get single hero in cache-aside strategy: get cache first, if not exist, fetch from external API.
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async getHeroById(id: string): Promise<Hero> {
    const key = `${this.GET_HERO_BY_ID_KEY}${id}`;
    const cachedHero = await this.cacheService.get<string>(key);
    if (cachedHero) {
      return JSON.parse(cachedHero);
    }

    const hero: Hero = await this.httpApi.getHeroById(id);
    await this.cacheService.set(key, JSON.stringify(hero));

    return hero;
  }

  /**
   * @description Get single hero with profile in cache-aside strategy: get cache first, if not exist, fetch from external API.
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async getHeroWithProfileById(id: string): Promise<Hero> {
    const key = `${this.GET_HERO_WITH_PROFILE_BY_ID_KEY}${id}   `;
    const cachedHero = await this.cacheService.get<string>(key);
    if (cachedHero) {
      return JSON.parse(cachedHero);
    }

    const hero: Hero = await this.httpApi.getHeroById(id);
    hero.profile = await this.httpApi.getHeroProfileById(id);
    await this.cacheService.set(key, JSON.stringify(hero));

    return hero;
  }
}
