# ZenCore CMS Backend

基于 Nest.js 的企业级多租户 CMS 后端 API。

## 技术栈

- **框架**: Nest.js 10.x
- **语言**: TypeScript 5.x
- **数据库**: MySQL 8.0+
- **ORM**: TypeORM
- **认证**: JWT + Passport
- **API文档**: Swagger
- **缓存**: Redis
- **消息队列**: Bull

## 快速开始

### 环境要求

- Node.js >= 18.x
- MySQL >= 8.0
- Redis >= 6.0

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

### 初始化数据库

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE zencore_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入数据库结构
mysql -u root -p zencore_cms < ../database/schema.sql
```

### 运行项目

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

访问 http://localhost:3000/api/v1

查看 API 文档: http://localhost:3000/api/docs

## 项目结构

```
src/
├── modules/              # 业务模块
│   ├── tenant/          # 租户模块
│   ├── user/            # 用户模块
│   ├── auth/            # 认证模块
│   ├── content/         # 内容模块
│   ├── template/        # 模板模块
│   ├── agent/           # 代理模块
│   ├── subscription/    # 订阅模块
│   └── payment/         # 支付模块
├── common/              # 公共模块
│   ├── decorators/      # 装饰器
│   ├── filters/         # 异常过滤器
│   ├── guards/          # 守卫
│   ├── interceptors/    # 拦截器
│   ├── middleware/      # 中间件
│   └── pipes/           # 管道
├── config/              # 配置文件
├── database/            # 数据库相关
└── main.ts             # 入口文件
```

## 核心功能

### 多租户支持

系统采用共享数据库、共享Schema的多租户架构：

- 每个表包含 `tenant_id` 字段
- 通过中间件自动注入租户过滤条件
- 支持租户配额管理和限流

### 认证与授权

- JWT Token 认证
- 基于 RBAC 的权限控制
- 支持双因素认证(2FA)
- 登录失败锁定机制

### API 安全

- Helmet 安全头
- CORS 跨域控制
- 接口限流(Throttle)
- SQL 注入防护
- XSS 防护

## 测试

```bash
# 单元测试
npm run test

# E2E 测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## 部署

参考 [部署文档](../docs/deployment/README.md)

## License

MIT
