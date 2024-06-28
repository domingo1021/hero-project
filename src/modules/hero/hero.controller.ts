import { Controller, Get } from '@nestjs/common';

import { HeroService } from '#hero/hero.service';
import { GetHerosResponseDto } from '#hero/dto';

@Controller()
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get('heroes')
  async getHeroes(): Promise<GetHerosResponseDto> {
    const heroes = await this.heroService.findAll();

    return { heroes };
  }
}
