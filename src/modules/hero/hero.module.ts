import { Module } from '@nestjs/common';

import { ExternalHttpModule } from '#http/http.module';
import { AuthModule } from '#auth/auth.module';
import { CacheConfigModule } from '#cache/cache.module';
import { HeroController } from '#hero/hero.controller';
import { HeroService } from '#hero/hero.service';
import { HeroRepositoryImpl } from '#hero/hero.repository.impl';

@Module({
  imports: [CacheConfigModule, AuthModule, ExternalHttpModule],
  controllers: [HeroController],
  providers: [
    HeroService,
    {
      provide: 'HeroRepository',
      useClass: HeroRepositoryImpl,
    },
  ],
  exports: [HeroService],
})
export class HeroModule {}
