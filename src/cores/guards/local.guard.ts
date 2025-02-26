import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';

import { AuthService } from '#auth/auth.service';
import { InternalRequest } from '#cores/types';

/**
 * @description Guard to authenticate the user with local strategy, set authentication result to the `request.user` object.
 */
@Injectable()
export class LocalAuthGuard implements CanActivate {
  private readonly USERNAME_KEY = 'Username';
  private readonly PASSWORD_KEY = 'Password';

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: InternalRequest = context.switchToHttp().getRequest();
    const username = request.get(this.USERNAME_KEY) as string;
    const password = request.get(this.PASSWORD_KEY) as string;

    if (username === undefined || password === undefined) {
      request.user = { isAuthenticated: false };
    } else {
      request.user = await this.authService.validateUser(username, password);
    }

    return true;
  }
}
