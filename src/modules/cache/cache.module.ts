import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';

import { redisStore } from 'cache-manager-redis-store';

import { CacheService } from '#cache/cache.service';

// Referece: https://github.com/dabroek/node-cache-manager-redis-store/issues/53
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const DEFAULT_REDIS_HOST = 'localhost';
        const DEFAULT_REDIS_PORT = 6379;

        return {
          store: await redisStore({
            socket: {
              host: configService.get<string>('REDIS_HOST') || DEFAULT_REDIS_HOST,
              port: +(configService.get<number>('REDIS_PORT') || DEFAULT_REDIS_PORT),
            },
          }),
          ttl: 5000,
          max: 10,
        } as CacheModuleAsyncOptions;
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheConfigModule {}
