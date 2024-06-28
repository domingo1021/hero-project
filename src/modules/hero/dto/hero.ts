export interface Hero {
  id: string;
  name: string;
  image: string;
}

export interface GetHerosResponseDto {
  heroes: Array<Hero>;
}
