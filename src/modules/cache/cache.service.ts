import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';

import { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Retrieves a value from the cache.
   *
   * @param {string} key - The key of the value to retrieve.
   * @returns {Promise<T | null>} The cached value, or null if the value is not in the cache.
   */
  async get<T>(key: string): Promise<T | null> {
    const cachedValue = await this.cacheManager.get<T>(key);
    if (!cachedValue) return null;

    return cachedValue;
  }

  /**
   * @param key the key to store the value
   * @param value the value to be stored
   * @param ttl the time to live in seconds, default is until 4:00 AM next day
   * @returns {Promise<void>}
   */
  async set(key: string, value: any, ttl: number = -1): Promise<void> {
    if (ttl === -1) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(4, 0, 0, 0);

      ttl = Math.ceil((tomorrow.getTime() - now.getTime()) / 1000);
    }

    return this.cacheManager.set(key, value, ttl);
  }

  // Closing redis connection when NestJS app close: https://github.com/nestjs/nest/issues/8020
  async onModuleDestroy(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const client = this.cacheManager.store.getClient();
    await client.quit();
  }
}
