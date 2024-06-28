import { IsNumberString } from 'class-validator';

export interface Hero {
  id: string;
  name: string;
  image: string;
}

export interface GetHerosResponseDto {
  heroes: Array<Hero>;
}

export class GetSingleHeroReqParams {
  @IsNumberString()
  id: string;
}
