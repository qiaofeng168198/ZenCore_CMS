# ZenCore CMS 性能优化指南

## 概述

本文档详细说明ZenCore CMS系统的综合性能优化措施，涵盖后端、前端、数据库、缓存、CDN等多个层面。

## 🎯 性能目标

| 指标 | 目标值 | 当前值 | 状态 |
|------|--------|--------|------|
| 首屏加载时间 | < 1s | - | 待测试 |
| API响应时间(P95) | < 500ms | - | 待测试 |
| API响应时间(P99) | < 1s | - | 待测试 |
| 并发用户数 | > 1000 | - | 待测试 |
| 数据库查询时间 | < 50ms | - | 待测试 |
| 缓存命中率 | > 80% | - | 待测试 |

## 📦 已实现的优化

### 1. Redis 缓存系统

**位置**: `backend/src/modules/cache/`

#### 功能特性

- ✅ **统一缓存接口**: CacheService提供完整的缓存操作API
- ✅ **缓存装饰器**: `@Cacheable` 声明式缓存
- ✅ **缓存拦截器**: 自动缓存HTTP响应
- ✅ **缓存失效**: 支持单个/批量/模式匹配失效
- ✅ **缓存预热**: 应用启动时预加载热数据
- ✅ **原子操作**: 递增/递减计数器

#### 使用示例

```typescript
// 1. 使用装饰器
@Cacheable('users', 300)  // 缓存5分钟
async getUsers() {
  return this.userRepository.find();
}

// 2. 手动缓存
const users = await this.cacheService.wrap(
  'users:list',
  () => this.userRepository.find(),
  300
);

// 3. 缓存失效
await this.cacheService.invalidateList('users');
```

#### 缓存策略

| 数据类型 | 缓存时间 | 失效策略 |
|---------|---------|---------|
| 用户信息 | 10分钟 | 更新时失效 |
| 内容列表 | 5分钟 | 新增/更新时失效 |
| 模板列表 | 30分钟 | 新增/更新时失效 |
| 统计数据 | 1分钟 | 定时刷新 |
| 配置信息 | 1小时 | 手动失效 |

### 2. 数据库查询优化

**位置**: `database/optimizations/indexes.sql`

#### 索引优化

添加了60+个高效索引：

- **复合索引**: 多字段组合索引，提升复杂查询性能
- **覆盖索引**: 包含查询所需的所有字段，避免回表
- **前缀索引**: 对长字符串字段使用前缀索引
- **唯一索引**: 保证数据唯一性同时提升查询

#### 查询优化工具

**位置**: `backend/src/common/utils/query-optimizer.util.ts`

```typescript
// 1. 分页优化
QueryOptimizer.paginate(queryBuilder, page, pageSize);

// 2. 字段选择（避免SELECT *）
QueryOptimizer.selectFields(queryBuilder, 'user', ['id', 'name', 'email']);

// 3. 批量查询
const batches = QueryOptimizer.batchQuery(queryBuilder, 'id', ids, 100);

// 4. 流式处理大数据集
await QueryOptimizer.stream(queryBuilder, 1000, async (batch) => {
  await processBatch(batch);
});

// 5. EXISTS优化
const exists = await QueryOptimizer.exists(queryBuilder);
```

#### N+1 问题解决

```typescript
// ❌ 错误：N+1查询
const users = await this.userRepository.find();
for (const user of users) {
  user.posts = await this.postRepository.find({ userId: user.id });
}

// ✅ 正确：使用关联查询
const users = await this.userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'post')
  .getMany();
```

### 3. API 响应优化

#### 响应压缩

**位置**: `backend/src/common/middleware/compression.middleware.ts`

- ✅ **Gzip压缩**: 压缩级别6，平衡压缩率和速度
- ✅ **Brotli压缩**: 更高压缩率（需配置）
- ✅ **智能过滤**: 只压缩文本类型和大于1KB的响应

#### 分页优化

**位置**: `backend/src/common/dto/pagination.dto.ts`

```typescript
// 标准分页DTO
class PaginationDto {
  page: number = 1;
  pageSize: number = 10;  // 最大100

  get skip(): number;
  get take(): number;
}

// 分页结果
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### 4. 异步任务队列

**位置**: `backend/src/modules/queue/`

#### 队列类型

- **email**: 邮件发送队列
- **notification**: 通知发送队列
- **report**: 报表生成队列

#### 功能特性

- ✅ **自动重试**: 失败任务自动重试3次（指数退避）
- ✅ **优先级**: 支持任务优先级设置
- ✅ **延迟执行**: 支持延迟任务
- ✅ **定时任务**: 支持Cron表达式
- ✅ **批量操作**: 支持批量添加任务
- ✅ **进度跟踪**: 任务进度实时更新

#### 使用示例

```typescript
// 1. 发送单个邮件
await this.queueService.sendEmail({
  to: 'user@example.com',
  subject: 'Welcome',
  template: 'welcome',
  data: { name: 'John' }
});

// 2. 批量发送邮件
await this.queueService.sendBulkEmails(emails);

// 3. 定时生成报表
await this.queueService.scheduleReport({
  type: 'daily_sales',
  params: {},
  userId: 1
}, '0 0 * * *');  // 每天凌晨
```

### 5. 前端性能优化

**位置**: `frontend/admin/vite.config.performance.ts`

#### 代码分割

- ✅ **自动分割**: Vue/Element Plus/工具库分离
- ✅ **按需加载**: 路由级别懒加载
- ✅ **预加载**: 关键资源预加载

#### 资源优化

- ✅ **Gzip/Brotli压缩**: 代码体积减小60-80%
- ✅ **图片压缩**: 自动压缩图片
- ✅ **Tree Shaking**: 移除未使用代码
- ✅ **CSS提取**: CSS独立文件
- ✅ **资源内联**: 小于4KB的资源内联

#### 打包分析

```bash
npm run build
# 生成 dist/stats.html 查看打包分析
```

#### 分块策略

```
dist/
├── js/
│   ├── vue-vendor-[hash].js      # Vue核心 (~150KB)
│   ├── element-plus-[hash].js    # UI库 (~500KB)
│   ├── utils-[hash].js           # 工具库 (~50KB)
│   └── [route]-[hash].js         # 路由分块
├── css/
│   └── [name]-[hash].css
└── images/
    └── [name]-[hash].[ext]
```

### 6. Nginx 性能优化

**位置**: `docker/nginx/nginx-performance.conf`

#### 连接优化

- ✅ **Worker进程**: 自动设置为CPU核心数
- ✅ **连接数**: 每个worker 4096连接
- ✅ **Keepalive**: 长连接复用
- ✅ **事件模型**: 使用epoll高效模型

#### 缓存策略

```nginx
# 静态资源缓存1年
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# API响应缓存5分钟（GET请求）
location /api/ {
    proxy_cache proxy_cache;
    proxy_cache_valid 200 5m;
}
```

#### 压缩配置

- ✅ **Gzip**: 压缩级别6
- ✅ **压缩类型**: 文本/JSON/JS/CSS/SVG
- ✅ **最小文件**: 1000字节

#### 限流防护

```nginx
# 每秒10个请求，突发20个
limit_req zone=req_limit burst=20 nodelay;

# 每个IP最多10个连接
limit_conn conn_limit 10;
```

## 🚀 性能优化最佳实践

### 后端优化

#### 1. 使用缓存

```typescript
// ✅ 好的做法：使用缓存
async getUser(id: number) {
  return this.cacheService.cacheEntity(
    'user',
    id,
    () => this.userRepository.findOne({ where: { id } }),
    600  // 10分钟
  );
}

// ❌ 不好的做法：每次都查数据库
async getUser(id: number) {
  return this.userRepository.findOne({ where: { id } });
}
```

#### 2. 批量操作

```typescript
// ✅ 好的做法：批量插入
await QueryOptimizer.bulkInsert(repository, entities, 1000);

// ❌ 不好的做法：逐个插入
for (const entity of entities) {
  await repository.save(entity);
}
```

#### 3. 异步处理

```typescript
// ✅ 好的做法：耗时操作放入队列
async createOrder(data) {
  const order = await this.orderRepository.save(data);

  // 异步发送邮件
  await this.queueService.sendEmail({
    to: order.email,
    subject: '订单确认',
    template: 'order',
    data: order
  });

  return order;
}

// ❌ 不好的做法：同步发送邮件
async createOrder(data) {
  const order = await this.orderRepository.save(data);
  await this.emailService.send(...);  // 阻塞等待
  return order;
}
```

#### 4. 选择合适的字段

```typescript
// ✅ 好的做法：只查询需要的字段
await this.userRepository
  .createQueryBuilder('user')
  .select(['user.id', 'user.name', 'user.email'])
  .getMany();

// ❌ 不好的做法：查询所有字段
await this.userRepository.find();
```

### 前端优化

#### 1. 路由懒加载

```typescript
// router/index.ts
const routes = [
  {
    path: '/contents',
    component: () => import('@/views/tenant/Contents.vue')  // 懒加载
  }
]
```

#### 2. 图片优化

```vue
<!-- 使用WebP格式 -->
<img src="@/assets/image.webp" alt="..." loading="lazy" />

<!-- 响应式图片 -->
<img
  srcset="image-320w.jpg 320w,
          image-640w.jpg 640w,
          image-1280w.jpg 1280w"
  sizes="(max-width: 320px) 280px,
         (max-width: 640px) 600px,
         1200px"
  src="image-640w.jpg"
  alt="..."
/>
```

#### 3. 虚拟滚动

```vue
<!-- 使用虚拟滚动处理大列表 -->
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :height="600"
  />
</template>
```

#### 4. 防抖节流

```typescript
import { debounce } from 'lodash-es'

// 搜索防抖
const handleSearch = debounce((keyword: string) => {
  fetchData(keyword)
}, 300)
```

## 📊 性能监控

### 1. 后端监控

```bash
# 查看应用指标
curl http://localhost:3000/monitoring/metrics

# 查看系统资源
curl http://localhost:3000/monitoring/system/metrics

# 查看数据库性能
curl http://localhost:3000/monitoring/database/metrics
```

### 2. Grafana仪表板

访问 http://localhost:3001 查看：

- API响应时间分布
- 请求率和错误率
- 系统资源使用
- 数据库连接池状态
- 缓存命中率

### 3. 数据库监控

```sql
-- 查看慢查询
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 10;

-- 查看表大小
SELECT
  table_name,
  ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'zencore_cms'
ORDER BY size_mb DESC;

-- 查看索引使用情况
SHOW INDEX FROM table_name;
```

## 🔧 性能调优

### 数据库调优

```ini
# my.cnf
[mysqld]
# InnoDB缓冲池（设置为物理内存的70-80%）
innodb_buffer_pool_size = 4G

# 每个线程的排序缓冲区
sort_buffer_size = 2M

# 连接数
max_connections = 500

# 查询缓存（MySQL 5.7）
query_cache_size = 128M
query_cache_type = 1

# 慢查询日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 1
```

### Redis调优

```conf
# redis.conf
# 最大内存
maxmemory 2gb

# 淘汰策略
maxmemory-policy allkeys-lru

# 持久化
save 900 1
save 300 10
save 60 10000

# AOF
appendonly yes
appendfsync everysec
```

### Node.js调优

```bash
# 启动参数
node --max-old-space-size=4096 \
     --max-semi-space-size=64 \
     dist/main.js
```

## 📈 性能基准测试

### 1. API性能测试

```bash
# 使用Apache Bench
ab -n 10000 -c 100 http://localhost:3000/api/contents

# 使用wrk
wrk -t12 -c400 -d30s http://localhost:3000/api/contents
```

### 2. 数据库性能测试

```bash
# 使用sysbench
sysbench oltp_read_write \
  --mysql-host=localhost \
  --mysql-user=root \
  --mysql-password=password \
  --mysql-db=zencore_cms \
  --tables=10 \
  --table-size=100000 \
  prepare

sysbench oltp_read_write \
  --mysql-host=localhost \
  --mysql-user=root \
  --mysql-password=password \
  --mysql-db=zencore_cms \
  --tables=10 \
  --table-size=100000 \
  --threads=16 \
  --time=60 \
  run
```

### 3. 前端性能测试

```bash
# 使用Lighthouse
lighthouse https://your-domain.com --output html --output-path report.html

# 使用WebPageTest
# 访问 https://www.webpagetest.org/
```

## 🎯 待优化项

### 高优先级

- [ ] 实施数据库读写分离
- [ ] 配置CDN加速静态资源
- [ ] 实现全文搜索（Elasticsearch）
- [ ] 实现Session分布式存储

### 中优先级

- [ ] 实现GraphQL API
- [ ] 添加HTTP/2服务器推送
- [ ] 实现Service Worker缓存
- [ ] 优化Docker镜像大小

### 低优先级

- [ ] 实现骨架屏加载
- [ ] 添加PWA支持
- [ ] 实现预渲染（SSG）
- [ ] 实现微前端架构

## 📚 参考资料

- [Nest.js Performance](https://docs.nestjs.com/techniques/performance)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Redis Performance Optimization](https://redis.io/topics/optimization)
- [Vue.js Performance Guide](https://vuejs.org/guide/best-practices/performance.html)
- [Nginx Performance Tuning](https://www.nginx.com/blog/tuning-nginx/)
