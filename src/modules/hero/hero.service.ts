import { Injectable } from '@nestjs/common';

import { Hero } from '#hero/dto';
import { ExternalHttpService } from '#http/http.service';

@Injectable()
export class HeroService {
  constructor(private readonly http: ExternalHttpService) {}

  /**
   * @todo Need to add cache strategy to loose coupling with unsteady external api
   * @description Get all heroes
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async findAll(): Promise<Array<Hero>> {
    return this.http.getHeroes();
  }

  async findById(id: string): Promise<Hero> {
    return this.http.getHeroById(id);
  }
}
