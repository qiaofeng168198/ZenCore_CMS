import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as compression from 'compression';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  private compression = compression({
    // 压缩级别 (0-9, 9为最高压缩率但最慢)
    level: 6,
    // 只压缩大于1KB的响应
    threshold: 1024,
    // 压缩过滤器
    filter: (req: Request, res: Response) => {
      // 不压缩已经压缩的内容
      if (req.headers['x-no-compression']) {
        return false;
      }

      // 使用默认过滤器
      return compression.filter(req, res);
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.compression(req, res, next);
  }
}
