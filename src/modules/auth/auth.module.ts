import { Global, Module } from '@nestjs/common';

import { ExternalHttpModule } from '#http/http.module';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [ExternalHttpModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
