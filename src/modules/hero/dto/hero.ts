import { IsNumberString } from 'class-validator';

export interface Hero {
  id: string;
  name: string;
  image: string;
  profile?: HeroProfile;
}

export interface HeroProfile {
  str: number;
  int: number;
  agi: number;
  luk: number;
}

export interface GetHerosResponseDto {
  heroes: Array<Hero>;
}

export class GetSingleHeroReqParams {
  @IsNumberString()
  id: string;
}
