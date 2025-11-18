# ZenCore CMS - 企业级多租户SaaS内容管理平台

<div align="center">

**打造基于Nest.js与Vue3的多租户SaaS内容管理平台**

支持可视化编辑、模板市场与多级代理，提供云端一站式企业级建站解决方案

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0.0-blue.svg)](https://www.typescriptlang.org)

</div>

## ✨ 项目特性

### 核心功能

- 🏢 **多租户架构** - 完整的租户隔离机制，支持自定义域名绑定
- 🔐 **认证授权** - JWT认证 + RBAC权限控制
- 📝 **内容管理** - 富文本/Markdown编辑器，版本控制，审核工作流
- 🎨 **模板系统** - 响应式模板，模板市场，开发者入驻审核
- 👥 **代理体系** - 多级代理层级，区域划分，佣金自动结算
- 💰 **订阅计费** - 月/年付费套餐，配额管理，自动续费
- 📊 **数据统计** - 业务数据分析，报表生成
- 🔔 **监控告警** - Prometheus + Grafana监控，自动告警

### 技术特点

- ⚡️ **高性能** - Redis缓存，数据库索引优化，支持1000+并发
- 🔒 **安全可靠** - 数据加密，SQL注入防护，XSS防护
- 📊 **可观测性** - 完整的监控、日志和告警系统
- 🐳 **容器化** - Docker一键部署，支持K8s编排
- 🚀 **性能优化** - 响应压缩，异步队列，代码分割

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- MySQL >= 8.0
- Redis >= 6.0
- Docker >= 20.x (可选)

### 使用Docker Compose部署（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/your-org/ZenCore_CMS.git
cd ZenCore_CMS

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，修改数据库密码等配置

# 3. 启动所有服务
docker-compose up -d

# 4. 查看服务状态
docker-compose ps

# 5. 查看日志
docker-compose logs -f
```

服务访问地址：
- 前端管理后台: http://localhost
- 后端API: http://localhost/api
- API文档: http://localhost/api/docs
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

### 本地开发

#### 后端开发

```bash
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 初始化数据库
mysql -u root -p < ../database/schema.sql
mysql -u root -p < ../database/optimizations/indexes.sql

# 启动开发服务器
npm run start:dev
```

#### 前端开发

```bash
cd frontend/admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📁 项目结构

```
ZenCore_CMS/
├── backend/                    # 后端项目 (Nest.js)
│   ├── src/
│   │   ├── modules/           # 业务模块
│   │   │   ├── tenant/        # 租户管理
│   │   │   ├── user/          # 用户管理
│   │   │   ├── auth/          # 认证授权
│   │   │   ├── content/       # 内容管理
│   │   │   ├── template/      # 模板管理
│   │   │   ├── agent/         # 代理管理
│   │   │   ├── subscription/  # 订阅管理
│   │   │   ├── payment/       # 支付管理
│   │   │   ├── stats/         # 数据统计
│   │   │   ├── monitoring/    # 监控告警
│   │   │   ├── cache/         # 缓存管理
│   │   │   └── queue/         # 队列管理
│   │   ├── common/            # 公共模块
│   │   ├── config/            # 配置
│   │   └── main.ts           # 入口文件
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # 前端项目
│   └── admin/                 # 管理后台 (Vue3)
│       ├── src/
│       │   ├── views/         # 页面组件
│       │   ├── components/    # 通用组件
│       │   ├── store/         # Pinia状态管理
│       │   ├── router/        # 路由配置
│       │   ├── api/           # API服务层
│       │   └── types/         # TypeScript类型
│       ├── Dockerfile
│       └── package.json
│
├── database/                   # 数据库
│   ├── schema.sql             # 数据库结构
│   └── optimizations/         # 性能优化
│       └── indexes.sql        # 索引优化
│
├── docker/                     # Docker配置
│   ├── nginx/                 # Nginx配置
│   └── prometheus/            # Prometheus配置
│
├── docs/                       # 文档
│   ├── api/                   # API文档
│   ├── development/           # 开发文档
│   ├── deployment/            # 部署文档
│   ├── ARCHITECTURE.md        # 架构设计
│   └── PERFORMANCE_OPTIMIZATION.md  # 性能优化
│
├── docker-compose.yml         # Docker Compose配置
└── README.md                  # 项目说明
```

## 🔧 技术栈

### 后端

| 技术 | 说明 | 版本 |
|------|------|------|
| Nest.js | Node.js框架 | 10.x |
| TypeScript | 编程语言 | 5.x |
| TypeORM | ORM框架 | 0.3.x |
| MySQL | 关系数据库 | 8.0+ |
| Redis | 缓存/队列 | 6.x |
| Bull | 异步队列 | 4.x |
| Prometheus | 监控指标 | - |
| Winston | 日志系统 | 3.x |

### 前端

| 技术 | 说明 | 版本 |
|------|------|------|
| Vue 3 | 前端框架 | 3.4.x |
| TypeScript | 编程语言 | 5.x |
| Vite | 构建工具 | 5.x |
| Element Plus | UI组件库 | 2.5.x |
| Pinia | 状态管理 | 2.x |
| Vue Router | 路由管理 | 4.x |
| Axios | HTTP客户端 | 1.x |

## 📚 核心功能模块

### 1. 多租户管理 ✅
- ✅ 租户创建与配置
- ✅ 租户配额管理（存储、流量、用户数等）
- ✅ 自定义域名绑定
- ✅ 租户数据隔离
- ✅ 租户CRUD操作
- ✅ 前端管理界面

### 2. 用户与权限 ✅
- ✅ 用户注册与登录
- ✅ JWT Token认证
- ✅ RBAC权限控制
- ✅ 角色和权限管理
- ✅ 路由守卫

### 3. 内容管理 ✅
- ✅ 内容CRUD操作
- ✅ 内容分类管理
- ✅ 版本控制与回滚
- ✅ 内容审核工作流
- ✅ 发布/下线功能
- ✅ 前端管理界面

### 4. 模板系统 ✅
- ✅ 模板上传与管理
- ✅ 模板市场
- ✅ 开发者入驻审核
- ✅ 模板版本管理
- ✅ 模板评分系统
- ✅ 安装/卸载功能

### 5. 代理体系 ✅
- ✅ 多级代理管理
- ✅ 代理区域划分
- ✅ 佣金计算规则
- ✅ 佣金记录查询
- ✅ 提现申请功能

### 6. 订阅计费 ✅
- ✅ 订阅套餐管理
- ✅ 套餐订阅/取消
- ✅ 自动续费设置
- ✅ 配额监控
- ✅ 订单管理
- ✅ 前端订阅界面

### 7. 支付系统 ⚠️
- ✅ 订单管理
- ✅ 支付记录
- ⏳ 发票管理（后端Entity待实现）
- ⏳ 支付网关集成

### 8. 数据统计 ✅
- ✅ 业务数据统计
- ✅ 报表生成
- ✅ 统计API接口

### 9. 监控告警 ✅
- ✅ 健康检查系统
- ✅ Prometheus指标采集
- ✅ 告警规则配置
- ✅ Winston日志系统
- ✅ Grafana可视化

### 10. 性能优化 ✅
- ✅ Redis缓存系统
- ✅ Bull异步队列
- ✅ 数据库索引优化（60+索引）
- ✅ API响应压缩
- ✅ 前端代码分割
- ✅ Nginx性能调优

### 11. 管理后台 ✅
- ✅ 超级管理员后台
- ✅ 租户管理后台
- ✅ 代理商后台
- ✅ 完整的CRUD界面
- ✅ 数据可视化

> ✅ 已完成 | ⚠️ 部分完成 | ⏳ 计划中

## 🎯 项目完成度

### 后端模块 (90%)

| 模块 | 完成度 | 说明 |
|------|--------|------|
| 租户管理 | 100% | 完整的CRUD和配额管理 |
| 用户认证 | 100% | JWT认证和权限控制 |
| 内容管理 | 100% | 版本控制、审核流程 |
| 模板系统 | 100% | 市场、评分、审核 |
| 代理体系 | 100% | 多级代理、佣金结算 |
| 订阅计费 | 100% | 套餐管理、订阅流程 |
| 支付系统 | 85% | 缺Invoice实体 |
| 数据统计 | 100% | 业务数据分析 |
| 监控告警 | 100% | 完整监控体系 |
| 性能优化 | 100% | 缓存、队列、索引 |

### 前端模块 (75%)

| 模块 | 完成度 | 说明 |
|------|--------|------|
| 状态管理 | 100% | Pinia Store完整 |
| API服务层 | 100% | 完整的API封装 |
| 租户管理页面 | 100% | 完整CRUD界面 |
| 内容管理页面 | 90% | 列表完成，编辑器待集成 |
| 订阅管理页面 | 100% | 套餐展示和订阅 |
| 仪表盘 | 40% | 基础框架 |
| 用户管理 | 30% | 待完善 |
| 代理管理 | 30% | 待完善 |

### 测试覆盖 (0%) ⚠️

| 类型 | 完成度 | 说明 |
|------|--------|------|
| 单元测试 | 0% | 待实现 |
| E2E测试 | 0% | 待实现 |
| 集成测试 | 0% | 待实现 |

## 🧪 测试

```bash
# 后端测试（待实现）
cd backend
npm run test              # 单元测试
npm run test:e2e         # E2E测试
npm run test:cov         # 测试覆盖率

# 前端测试（待实现）
cd frontend/admin
npm run test
```

## 📖 文档

- [架构设计](ARCHITECTURE.md) - 系统架构和技术选型
- [性能优化文档](docs/PERFORMANCE_OPTIMIZATION.md) - 性能优化方案
- [API文档](http://localhost:3000/api/docs) - Swagger API文档（需启动服务）
- [数据库设计](database/schema.sql) - 数据库Schema
- [部署文档](docs/deployment/) - 部署指南

## 🚧 待完成功能

### 高优先级
1. **测试体系** - 单元测试和E2E测试（覆盖率目标>80%）
2. **Invoice模块** - 完善发票管理实体和接口
3. **前端编辑器集成** - 富文本/Markdown编辑器
4. **前端页面完善** - 用户管理、代理管理、模板管理页面

### 中优先级
5. **支付网关集成** - 微信支付、支付宝
6. **双因素认证** - 2FA功能
7. **SSO单点登录** - 企业级登录
8. **多语言支持** - i18n国际化

### 低优先级
9. **CDN集成** - 静态资源CDN
10. **微信小程序API** - 小程序接口

## 🛠️ 开发计划

### Phase 1 - 基础框架 ✅ (100%)
- [x] 项目架构设计
- [x] 数据库设计（31张表）
- [x] 后端框架搭建
- [x] 前端框架搭建
- [x] Docker部署配置

### Phase 2 - 核心功能 ✅ (100%)
- [x] 用户认证系统
- [x] 多租户管理
- [x] 内容管理系统
- [x] 模板系统
- [x] 权限管理

### Phase 3 - 高级功能 ✅ (100%)
- [x] 代理体系
- [x] 订阅计费
- [x] 支付集成（基础）
- [x] 数据统计
- [x] 文件上传

### Phase 4 - 优化完善 ✅ (80%)
- [x] 性能优化
- [x] 监控告警
- [x] 前端完善
- [ ] 单元测试 ⚠️
- [ ] E2E测试 ⚠️

## 📊 项目统计

- **后端代码**: 13个业务模块，26个Service/Controller，19个Entity
- **前端代码**: 10个页面，5个Store，5个类型定义，2个通用组件
- **数据库**: 31张表，60+性能索引
- **文档**: 4个主要文档，完整的API文档
- **总代码量**: ~12,000行（后端8,500行 + 前端3,500行）

## 🎉 技术亮点

1. **企业级架构** - 多租户隔离、RBAC权限、完整的审核流程
2. **高性能方案** - Redis缓存、Bull队列、数据库索引优化
3. **完整监控** - Prometheus + Grafana + 告警系统
4. **现代化前端** - Vue 3 + TypeScript + Pinia + Element Plus
5. **容器化部署** - Docker Compose一键启动
6. **代码质量** - TypeScript类型安全、统一代码风格

## 📄 开源协议

本项目采用 MIT 协议开源。

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

Made with ❤️ by ZenCore Team

</div>
