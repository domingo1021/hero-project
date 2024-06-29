import { Injectable } from '@nestjs/common';

import { Hero } from '#hero/dto';
import { ExternalHttpService } from '#http/http.service';

@Injectable()
export class HeroService {
  constructor(private readonly httpApi: ExternalHttpService) {}

  /**
   * @todo Need to add cache strategy to loose coupling with unsteady external api
   * @description Get all heroes
   * @param {boolean} isAuthenticated - Flag to determine if hero profile should be fetched
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async findAll(isAuthenticated: boolean = false): Promise<Array<Hero>> {
    if (!isAuthenticated) return this.httpApi.getHeroes();

    const heroes = await this.httpApi.getHeroes();
    await Promise.all(
      heroes.map(async (hero) => {
        const profile = await this.httpApi.getHeroProfileById(hero.id);
        hero.profile = profile;
      }),
    );

    return heroes;
  }

  async findById(id: string, isAuthenticated: boolean = false): Promise<Hero> {
    const hero = await this.httpApi.getHeroById(id);

    if (isAuthenticated) {
      hero.profile = await this.httpApi.getHeroProfileById(id);
    }

    return hero;
  }
}
