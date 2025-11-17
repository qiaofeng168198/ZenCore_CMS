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
- 🔐 **认证授权** - JWT认证 + RBAC权限控制，支持双因素认证
- 📝 **内容管理** - 富文本/Markdown编辑器，版本控制，审核工作流
- 🎨 **模板系统** - 响应式模板，模板市场，第三方开发者入驻
- 👥 **代理体系** - 多级代理层级，区域划分，佣金自动结算
- 💰 **订阅计费** - 月/年付费，按流量计费，增值服务
- 📱 **多端支持** - 响应式Web，微信小程序，开放API接入

### 技术特点

- ⚡️ **高性能** - 响应时间<500ms，支持1000+并发
- 🔒 **安全可靠** - 数据加密，SQL注入防护，XSS防护
- 📊 **可观测性** - 完整的监控、日志和告警系统
- 🐳 **容器化** - Docker一键部署，支持K8s编排
- 🧪 **高测试覆盖** - 单元测试覆盖率>80%，完整的E2E测试

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
- MinIO控制台: http://localhost:9001

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
│   │   ├── common/            # 公共模块
│   │   ├── config/            # 配置
│   │   └── main.ts           # 入口文件
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # 前端项目
│   └── admin/                 # 管理后台 (Vue3)
│       ├── src/
│       │   ├── views/         # 页面
│       │   ├── components/    # 组件
│       │   ├── store/         # 状态管理
│       │   └── router/        # 路由
│       ├── Dockerfile
│       └── package.json
│
├── database/                   # 数据库
│   └── schema.sql             # 数据库结构
│
├── docker/                     # Docker配置
│   ├── nginx/                 # Nginx配置
│   └── mysql/                 # MySQL配置
│
├── docs/                       # 文档
│   ├── api/                   # API文档
│   └── deployment/            # 部署文档
│
├── docker-compose.yml         # Docker Compose配置
├── ARCHITECTURE.md            # 架构设计文档
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
| Redis | 缓存数据库 | 6.x |
| JWT | 身份认证 | - |
| Swagger | API文档 | - |

### 前端

| 技术 | 说明 | 版本 |
|------|------|------|
| Vue | 前端框架 | 3.4.x |
| TypeScript | 编程语言 | 5.x |
| Vite | 构建工具 | 5.x |
| Element Plus | UI组件库 | 2.5.x |
| Pinia | 状态管理 | 2.x |
| Vue Router | 路由管理 | 4.x |

## 📚 核心功能模块

### 1. 多租户管理
- ✅ 租户创建与配置
- ✅ 租户配额管理（存储、流量、用户数等）
- ✅ 自定义域名绑定
- ✅ 租户数据隔离

### 2. 用户与权限
- ✅ 用户注册与登录
- ✅ JWT Token认证
- ✅ RBAC权限控制
- ⏳ 双因素认证(2FA)
- ⏳ SSO单点登录

### 3. 内容管理
- ⏳ 富文本编辑器
- ⏳ Markdown编辑器
- ⏳ 内容分类管理
- ⏳ 版本控制与回滚
- ⏳ 内容审核工作流
- ⏳ 定时发布/下线
- ⏳ 多语言支持

### 4. 模板系统
- ⏳ 模板上传与管理
- ⏳ 模板市场
- ⏳ 开发者入驻审核
- ⏳ 模板版本管理
- ⏳ 模板评价系统
- ⏳ 佣金自动结算

### 5. 代理体系
- ⏳ 多级代理管理
- ⏳ 代理区域划分
- ⏳ 佣金计算规则
- ⏳ 业绩报表统计

### 6. 订阅计费
- ⏳ 订阅套餐管理
- ⏳ 在线支付集成
- ⏳ 自动续费
- ⏳ 发票管理
- ⏳ 流量计费

### 7. 管理后台
- ✅ 超级管理员后台
- ✅ 代理商后台
- ✅ 租户管理后台
- ⏳ 数据统计与分析

> ✅ 已完成 | ⏳ 开发中 | ⭕ 计划中

## 🧪 测试

```bash
# 后端测试
cd backend
npm run test              # 单元测试
npm run test:e2e         # E2E测试
npm run test:cov         # 测试覆盖率

# 前端测试
cd frontend/admin
npm run test
```

## 📖 文档

- [架构设计](ARCHITECTURE.md)
- [API文档](http://localhost:3000/api/docs) (需启动后端服务)
- [数据库设计](database/schema.sql)

## 🛠️ 开发计划

### Phase 1 - 基础框架 ✅
- [x] 项目架构设计
- [x] 数据库设计
- [x] 后端框架搭建
- [x] 前端框架搭建
- [x] Docker部署配置

### Phase 2 - 核心功能 🚧
- [x] 用户认证系统
- [x] 多租户管理
- [ ] 内容管理系统
- [ ] 模板系统
- [ ] 权限管理

### Phase 3 - 高级功能 ⏳
- [ ] 代理体系
- [ ] 订阅计费
- [ ] 支付集成
- [ ] 数据统计
- [ ] 文件上传

### Phase 4 - 优化完善 ⏳
- [ ] 性能优化
- [ ] 单元测试
- [ ] E2E测试
- [ ] 监控告警
- [ ] CDN集成

## 📄 开源协议

本项目采用 MIT 协议开源。

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

Made with ❤️ by ZenCore Team

</div>
