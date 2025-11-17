import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../cache.service';
import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '../decorators/cacheable.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const keyPrefix = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    const ttl = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );

    // 如果没有缓存元数据，直接执行
    if (!keyPrefix) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(keyPrefix, request);

    // 尝试从缓存获取
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData !== undefined) {
      return of(cachedData);
    }

    // 执行实际方法并缓存结果
    return next.handle().pipe(
      tap(async (data) => {
        if (data !== undefined) {
          await this.cacheService.set(cacheKey, data, ttl);
        }
      }),
    );
  }

  private generateCacheKey(prefix: string, request: any): string {
    const { method, url, user, query, params } = request;

    // 生成包含用户、查询参数的唯一键
    const parts = [
      prefix,
      method,
      url.split('?')[0], // URL路径（不含查询参数）
      user?.id || 'anonymous',
    ];

    // 添加查询参数
    if (Object.keys(query).length > 0) {
      parts.push(JSON.stringify(query));
    }

    // 添加路径参数
    if (Object.keys(params).length > 0) {
      parts.push(JSON.stringify(params));
    }

    return this.cacheService.generateKey(...parts);
  }
}
