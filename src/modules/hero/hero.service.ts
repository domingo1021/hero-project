import { Injectable } from '@nestjs/common';

import { Hero } from '#hero/dto';
import { ExternalHttpService } from '#http/http.service';

@Injectable()
export class HeroService {
  constructor(private readonly http: ExternalHttpService) {}

  async findAll(): Promise<Array<Hero>> {
    return this.http.getHeroes();
  }
}
