import { Module } from '@nestjs/common';

import { AppController } from '#src/modules/app/app.controller';
import { HeroModule } from '#hero/hero.module';
import { HeroController } from '#hero/hero.controller';

@Module({
  controllers: [HeroController, AppController],
  imports: [HeroModule],
})
export class AppModule {}
