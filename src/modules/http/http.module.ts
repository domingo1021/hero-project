import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ExternalHttpService } from '#http/http.service';

@Module({
  imports: [HttpModule.register({ timeout: 5000, maxRedirects: 5 })],
  providers: [ExternalHttpService],
  exports: [ExternalHttpService],
})
export class ExternalHttpModule {}
