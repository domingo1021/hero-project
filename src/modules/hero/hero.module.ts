import { Module } from '@nestjs/common';

import { HeroController } from '#hero/hero.controller';
import { HeroService } from '#hero/hero.service';
import { ExternalHttpModule } from '#http/http.module';
import { AuthModule } from '#auth/auth.module';

@Module({
  imports: [AuthModule, ExternalHttpModule],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService],
})
export class HeroModule {}
