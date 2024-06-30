import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { LocalUser } from '#cores/types';
import { ExternalHttpService } from '#http/http.service';
import { CacheService } from '#cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly cache: CacheService,
    private readonly httpApi: ExternalHttpService,
  ) {}

  /**
   * @description validate the user with the given username and password. First check the cache, if not found, then check the external API
   * @param username the username to validate
   * @param password the password to validate
   * @returns { isAuthenticated: boolean } the result of the validation
   */
  async validateUser(username: string, password: string): Promise<LocalUser> {
    const cachedHashPass = await this.cache.get<string>(username);
    if (cachedHashPass && (await bcrypt.compare(password, cachedHashPass))) {
      return { isAuthenticated: true };
    }

    const isAuthenticated = await this.httpApi.authenticate(username, password);
    if (isAuthenticated) {
      const hashPass = await bcrypt.hash(password, 10);
      await this.cache.set(username, hashPass);
    }

    return { isAuthenticated };
  }
}
