import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export interface CacheOptions {
  ttl?: number; // 缓存时间（秒）
  key?: string; // 缓存键
}

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * 获取缓存
   */
  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  /**
   * 设置缓存
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * 删除缓存
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * 清空所有缓存
   */
  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }

  /**
   * 批量删除缓存（支持通配符）
   */
  async delPattern(pattern: string): Promise<void> {
    // 这需要直接使用Redis客户端
    const store: any = this.cacheManager.store;
    if (store.client) {
      const keys = await store.client.keys(pattern);
      if (keys.length > 0) {
        await store.client.del(...keys);
      }
    }
  }

  /**
   * 生成缓存键
   */
  generateKey(prefix: string, ...params: any[]): string {
    return `${prefix}:${params.join(':')}`;
  }

  /**
   * 缓存装饰器助手 - 包装函数以使用缓存
   */
  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 300,
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }

  /**
   * 缓存列表结果
   */
  async cacheList<T>(
    key: string,
    page: number,
    pageSize: number,
    fetchFn: () => Promise<{ data: T[]; total: number }>,
    ttl: number = 300,
  ): Promise<{ data: T[]; total: number }> {
    const cacheKey = this.generateKey(key, page, pageSize);
    return this.wrap(cacheKey, fetchFn, ttl);
  }

  /**
   * 缓存单个实体
   */
  async cacheEntity<T>(
    prefix: string,
    id: number | string,
    fetchFn: () => Promise<T>,
    ttl: number = 600,
  ): Promise<T> {
    const cacheKey = this.generateKey(prefix, id);
    return this.wrap(cacheKey, fetchFn, ttl);
  }

  /**
   * 使缓存失效
   */
  async invalidate(...keys: string[]): Promise<void> {
    await Promise.all(keys.map(key => this.del(key)));
  }

  /**
   * 使实体缓存失效
   */
  async invalidateEntity(prefix: string, id: number | string): Promise<void> {
    const pattern = this.generateKey(prefix, id) + '*';
    await this.delPattern(pattern);
  }

  /**
   * 使列表缓存失效
   */
  async invalidateList(prefix: string): Promise<void> {
    const pattern = `${prefix}:*`;
    await this.delPattern(pattern);
  }

  /**
   * 预热缓存
   */
  async warmup<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 3600,
  ): Promise<void> {
    const data = await fetchFn();
    await this.set(key, data, ttl);
  }

  /**
   * 获取或设置缓存（原子操作）
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 300,
  ): Promise<T> {
    return this.wrap(key, fetchFn, ttl);
  }

  /**
   * 递增计数器
   */
  async increment(key: string, value: number = 1): Promise<number> {
    const store: any = this.cacheManager.store;
    if (store.client) {
      return await store.client.incrBy(key, value);
    }
    throw new Error('Redis client not available');
  }

  /**
   * 递减计数器
   */
  async decrement(key: string, value: number = 1): Promise<number> {
    const store: any = this.cacheManager.store;
    if (store.client) {
      return await store.client.decrBy(key, value);
    }
    throw new Error('Redis client not available');
  }

  /**
   * 设置过期时间
   */
  async expire(key: string, seconds: number): Promise<void> {
    const store: any = this.cacheManager.store;
    if (store.client) {
      await store.client.expire(key, seconds);
    }
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    const store: any = this.cacheManager.store;
    if (store.client) {
      const result = await store.client.exists(key);
      return result > 0;
    }
    return false;
  }

  /**
   * 获取剩余过期时间
   */
  async ttl(key: string): Promise<number> {
    const store: any = this.cacheManager.store;
    if (store.client) {
      return await store.client.ttl(key);
    }
    return -1;
  }
}
