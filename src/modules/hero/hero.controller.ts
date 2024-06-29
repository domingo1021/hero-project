import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { User } from '#cores/decorators/user.decorator';
import { LocalUser } from '#cores/types';
import { LocalAuthGuard } from '#cores/guards/local.guard';
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
  @UseGuards(LocalAuthGuard)
  @Get('heroes')
  async getHeroes(@User() user: LocalUser): Promise<GetHerosResponseDto> {
    const { isAuthenticated } = user;
    const heroes = await this.heroService.findAll(isAuthenticated);

    return { heroes };
  }

  @UseGuards(LocalAuthGuard)
  @Get('heroes/:id')
  async getHeroById(
    @Param() params: GetSingleHeroReqParams,
    @User() user: LocalUser,
  ): Promise<Hero> {
    const { id } = params;
    const { isAuthenticated } = user;
    return this.heroService.findById(id, isAuthenticated);
  }
}
