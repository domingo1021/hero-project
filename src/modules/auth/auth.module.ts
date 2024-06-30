import { Global, Module } from '@nestjs/common';

import { ExternalHttpModule } from '#http/http.module';
import { CacheConfigModule } from '#cache/cache.module';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [CacheConfigModule, ExternalHttpModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
