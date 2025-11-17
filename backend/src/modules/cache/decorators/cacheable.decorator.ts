import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';

/**
 * 缓存装饰器
 * @param keyPrefix 缓存键前缀
 * @param ttl 缓存时间（秒）
 */
export const Cacheable = (keyPrefix: string, ttl: number = 300) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, keyPrefix)(target, propertyKey, descriptor);
    SetMetadata(CACHE_TTL_METADATA, ttl)(target, propertyKey, descriptor);
    return descriptor;
  };
};

/**
 * 缓存失效装饰器
 * @param patterns 需要失效的缓存键模式
 */
export const CacheEvict = (...patterns: string[]) => {
  return SetMetadata('cache:evict', patterns);
};

/**
 * 缓存更新装饰器
 * @param keyPrefix 需要更新的缓存键前缀
 */
export const CachePut = (keyPrefix: string) => {
  return SetMetadata('cache:put', keyPrefix);
};
