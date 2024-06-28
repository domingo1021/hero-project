import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Hero } from '#hero/dto';
import { INTERNAL_STATUS_CODE } from '#cores/constants';

@Injectable()
export class ExternalHttpService {
  private readonly EXTERNAL_ENDPOINT = {
    GET_HEROES: 'https://hahow-recruit.herokuapp.com/heroes',
  };
  constructor(private httpService: HttpService) {}

  private isHero(obj: any): obj is Hero {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj.id === 'string' &&
      typeof obj.name === 'string' &&
      typeof obj.image === 'string'
    );
  }

  /**
   * @description Get heroes from external api
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async getHeroes(): Promise<Array<Hero>> {
    return firstValueFrom(
      this.httpService.get(this.EXTERNAL_ENDPOINT.GET_HEROES).pipe(
        map((response) => response.data),
        map((heroes) => {
          if (!Array.isArray(heroes) || !heroes.every(this.isHero)) {
            throw new InternalServerErrorException({
              code: INTERNAL_STATUS_CODE.THIRDPARTY_API_RESPONSE_MISMATCH,
              message: `Invalid response format from upstream ${this.EXTERNAL_ENDPOINT.GET_HEROES}`,
            });
          }

          return heroes;
        }),
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException({
            code: INTERNAL_STATUS_CODE.THIRDPARTY_SERVER_ERROR,
            message: error.message,
          });
        }),
      ),
    );
  }

  async getHeroById(id: string): Promise<Hero> {
    return firstValueFrom(
      this.httpService.get(`${this.EXTERNAL_ENDPOINT.GET_HEROES}/${id}`).pipe(
        map((response) => response.data),
        map((hero) => {
          if (!this.isHero(hero)) {
            throw new InternalServerErrorException({
              code: INTERNAL_STATUS_CODE.THIRDPARTY_API_RESPONSE_MISMATCH,
              message: `Invalid response format from upstream ${this.EXTERNAL_ENDPOINT.GET_HEROES}/${id}`,
            });
          }

          return hero;
        }),
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException({
            code: INTERNAL_STATUS_CODE.THIRDPARTY_SERVER_ERROR,
            message: error.message,
          });
        }),
      ),
    );
  }
}
