import { Injectable } from '@nestjs/common';

import { ExternalHttpService } from '#http/http.service';
import { LocalUser } from '#cores/types';

@Injectable()
export class AuthService {
  constructor(private readonly externalApi: ExternalHttpService) {}

  async validateUser(username: string, password: string): Promise<LocalUser> {
    const isAuthenticated = await this.externalApi.authenticate(
      username,
      password,
    );

    return { isAuthenticated };
  }
}
