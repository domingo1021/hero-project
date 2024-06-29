import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';

import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const cachedValue = await this.cacheManager.get<T>(key);
    if (!cachedValue) return null;

    return cachedValue;
  }

  async set(key: string, value: any, ttl: number = -1): Promise<void> {
    if (ttl === -1) {
      return this.cacheManager.set(key, value);
    }

    return this.cacheManager.set(key, value, ttl);
  }
}
