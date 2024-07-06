import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { AxiosError } from 'axios';
import { firstValueFrom, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Hero, HeroProfile } from '#hero/dto';
import { HeroDataValidator } from '#hero/hero.validator';
import { CustomErrorCodes } from '#cores/types';

@Injectable()
export class ExternalHttpService {
  private readonly EXTERNAL_ENDPOINT = {
    GET_HEROES: 'https://hahow-recruit.herokuapp.com/heroes',
    AUTHENTICATE: 'https://hahow-recruit.herokuapp.com/auth',
  };

  constructor(private httpService: HttpService) {}

  /**
   * @description Get heroes from external api, throw if response is in invalid format.
   * @returns {Promise<Array<Hero>>}
   * @throws {InternalServerErrorException}
   */
  async getHeroes(): Promise<Array<Hero>> {
    return firstValueFrom(
      this.httpService.get(this.EXTERNAL_ENDPOINT.GET_HEROES).pipe(
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException({
            code: CustomErrorCodes.THIRDPARTY_SERVER_ERROR,
            message: error.message,
          });
        }),
        map((response) => response.data),
        map((heroes) => {
          if (!Array.isArray(heroes) || !heroes.every(HeroDataValidator.isHero)) {
            throw new InternalServerErrorException({
              code: CustomErrorCodes.THIRDPARTY_API_RESPONSE_MISMATCH,
              message: `Invalid response format from upstream ${this.EXTERNAL_ENDPOINT.GET_HEROES}`,
            });
          }

          return heroes;
        }),
      ),
    );
  }

  /**
   * @description Get single hero from external api, throw if response is in invalid format / network error.
   * @returns {Promise<Hero>}
   * @throws {NotFoundException}
   * @throws {InternalServerErrorException}
   */
  async getHeroById(id: string): Promise<Hero> {
    return firstValueFrom(
      this.httpService.get(`${this.EXTERNAL_ENDPOINT.GET_HEROES}/${id}`).pipe(
        catchError((error: AxiosError) => {
          if (error.response?.status === HttpStatus.NOT_FOUND) {
            throw new NotFoundException({
              code: CustomErrorCodes.HERO_NOT_FOUND,
              message: `Hero with id ${id} not found`,
            });
          }
          throw new InternalServerErrorException({
            code: CustomErrorCodes.THIRDPARTY_SERVER_ERROR,
            message: error.message,
          });
        }),
        map((response) => response.data),
        map((hero) => {
          if (!HeroDataValidator.isHero(hero)) {
            throw new InternalServerErrorException({
              code: CustomErrorCodes.THIRDPARTY_API_RESPONSE_MISMATCH,
              message: `Invalid response format from upstream ${this.EXTERNAL_ENDPOINT.GET_HEROES}/${id}`,
            });
          }

          return hero;
        }),
      ),
    );
  }

  /**
   * @description Get single hero profile, throw if response is in invalid format / network error.
   * @returns {Promise<HeroProfile>}
   * @throws {NotFoundException}
   * @throws {InternalServerErrorException}
   */
  async getHeroProfileById(id: string): Promise<HeroProfile> {
    return firstValueFrom(
      this.httpService.get(`${this.EXTERNAL_ENDPOINT.GET_HEROES}/${id}/profile`).pipe(
        catchError((error: AxiosError) => {
          if (error.status === HttpStatus.NOT_FOUND) {
            throw new NotFoundException({
              code: CustomErrorCodes.HERO_NOT_FOUND,
              message: `Hero with id ${id} not found`,
            });
          }
          throw new InternalServerErrorException({
            code: CustomErrorCodes.THIRDPARTY_SERVER_ERROR,
            message: error.message,
          });
        }),
        map((response) => response.data),
        map((heroProfile) => {
          if (!HeroDataValidator.isHeroProfile(heroProfile)) {
            throw new InternalServerErrorException({
              code: CustomErrorCodes.THIRDPARTY_API_RESPONSE_MISMATCH,
              message: `Invalid response format from upstream ${this.EXTERNAL_ENDPOINT.GET_HEROES}/${id}/profile`,
            });
          }

          return heroProfile;
        }),
      ),
    );
  }

  /**
   * @description Authenticate user with external api, return true if 2xx success response, otherwise return false.
   * @returns {Promise<boolean>}
   */
  async authenticate(username: string, password: string): Promise<boolean> {
    return firstValueFrom(
      this.httpService.post(this.EXTERNAL_ENDPOINT.AUTHENTICATE, { name: username, password }).pipe(
        map(() => true),
        catchError(() => of(false)),
      ),
    );
  }
}
