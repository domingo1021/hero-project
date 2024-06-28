import { Controller, Get, Param } from '@nestjs/common';

import { HeroService } from '#hero/hero.service';
import { GetHerosResponseDto, GetSingleHeroReqParams, Hero } from '#hero/dto';

@Controller()
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  /**
   * @description Fetches all heroes from the service layer, maps them to the GetHerosResponseDto format,
   * @route GET /heroes
   * @returns {Promise<GetHerosResponseDto>}
   * @throws {InternalServerErrorException}
   */
  @Get('heroes')
  async getHeroes(): Promise<GetHerosResponseDto> {
    const heroes = await this.heroService.findAll();

    return { heroes };
  }

  @Get('heroes/:id')
  async getHeroById(@Param() params: GetSingleHeroReqParams): Promise<Hero> {
    const { id } = params;
    return this.heroService.findById(id);
  }
}
