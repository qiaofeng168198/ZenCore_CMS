# 前端架构重构计划

## 📋 背景

当前项目只有一个前端项目 `frontend/admin`，通过 `userType` 区分不同角色（超级管理员、租户、代理商、开发者）。

这种单体多角色架构存在以下问题：
- ❌ 打包体积大（所有角色代码混在一起）
- ❌ 维护困难（代码耦合度高）
- ❌ 灵活性差（难以为不同角色定制UI/UX）
- ❌ 安全隐患（所有代码都在客户端）

## 🎯 重构目标

将单体前端拆分为4个独立项目：

```
frontend/
├── admin/              # 超级管理员后台（已存在）
├── tenant/             # 租户后台（新建）✅
├── agent/              # 代理商后台（新建）✅
├── developer/          # 模板开发者后台（新建）✅
└── shared/             # 共享代码库（待创建）
```

## 📁 新项目结构

### 1. 租户后台 (frontend/tenant)

```
tenant/
├── package.json        ✅ 已创建
├── vite.config.ts      📝 待创建
├── tsconfig.json       📝 待创建
├── index.html          📝 待创建
└── src/
    ├── main.ts         📝 待创建
    ├── App.vue         📝 待创建
    ├── views/          ✅ 目录已创建
    │   ├── Dashboard.vue
    │   ├── Contents/       # 内容管理
    │   ├── Templates/      # 模板管理
    │   ├── Subscription/   # 订阅管理
    │   └── Settings/       # 设置
    ├── router/         ✅ 目录已创建
    │   └── index.ts
    ├── store/          ✅ 目录已创建
    │   ├── user.ts
    │   ├── content.ts
    │   └── subscription.ts
    ├── api/            ✅ 目录已创建
    ├── components/     ✅ 目录已创建
    ├── layouts/        ✅ 目录已创建
    └── types/          ✅ 目录已创建
```

**端口**: 5174
**访问**: http://localhost:5174 或 https://app.zencore.com

### 2. 代理商后台 (frontend/agent)

```
agent/
├── package.json        ✅ 已创建
├── vite.config.ts      📝 待创建
├── tsconfig.json       📝 待创建
├── index.html          📝 待创建
└── src/
    ├── main.ts         📝 待创建
    ├── App.vue         📝 待创建
    ├── views/          ✅ 目录已创建
    │   ├── Dashboard.vue
    │   ├── Customers/      # 客户管理
    │   ├── Commission/     # 佣金管理
    │   ├── Performance/    # 业绩统计
    │   └── Team/          # 团队管理
    ├── router/         ✅ 目录已创建
    ├── store/          ✅ 目录已创建
    ├── api/            ✅ 目录已创建
    ├── components/     ✅ 目录已创建
    ├── layouts/        ✅ 目录已创建
    └── types/          ✅ 目录已创建
```

**端口**: 5175
**访问**: http://localhost:5175 或 https://agent.zencore.com

### 3. 开发者后台 (frontend/developer)

```
developer/
├── package.json        ✅ 已创建
├── vite.config.ts      📝 待创建
├── tsconfig.json       📝 待创建
├── index.html          📝 待创建
└── src/
    ├── main.ts         📝 待创建
    ├── App.vue         📝 待创建
    ├── views/          ✅ 目录已创建
    │   ├── Dashboard.vue
    │   ├── Templates/      # 我的模板
    │   ├── Revenue/        # 收益统计
    │   ├── Reviews/        # 用户评价
    │   └── Documentation/  # 开发文档
    ├── router/         ✅ 目录已创建
    ├── store/          ✅ 目录已创建
    ├── api/            ✅ 目录已创建
    ├── components/     ✅ 目录已创建
    ├── layouts/        ✅ 目录已创建
    └── types/          ✅ 目录已创建
```

**端口**: 5176
**访问**: http://localhost:5176 或 https://developer.zencore.com

### 4. 超级管理员后台 (frontend/admin)

保持现有结构，移除其他角色相关代码：

```
admin/
└── src/
    ├── views/
    │   ├── Dashboard.vue
    │   ├── super-admin/    # 保留
    │   ├── tenant/         ❌ 删除（移至tenant项目）
    │   └── agent/          ❌ 删除（移至agent项目）
    └── ...
```

**端口**: 5173
**访问**: http://localhost:5173 或 https://admin.zencore.com

## 🔧 实施步骤

### Phase 1: 创建项目基础结构 ✅ (已完成)

- [x] 创建目录结构
- [x] 创建 package.json
- [x] 创建 vite.config.ts
- [x] 创建 tsconfig.json
- [x] 创建 index.html
- [x] 创建 src/main.ts
- [x] 创建 src/App.vue
- [x] 创建 src/router/index.ts
- [x] 创建 src/styles/index.scss
- [x] 创建 src/store/user.ts
- [x] 创建 src/types/user.ts
- [x] 创建 src/api/request.ts
- [x] 创建 src/api/auth.ts
- [x] 创建 src/layouts/MainLayout.vue
- [x] 创建 src/views/Dashboard.vue
- [x] 创建 src/views/auth/Login.vue

### Phase 2: 提取共享代码

创建 `frontend/shared` 包：

```
shared/
├── package.json
├── src/
    ├── api/
    │   └── request.ts      # Axios封装
    ├── components/
    │   ├── PageContainer.vue
    │   └── SearchForm.vue
    ├── utils/
    │   ├── format.ts
    │   └── validate.ts
    ├── types/
    │   ├── common.ts
    │   └── api.ts
    └── styles/
        └── variables.scss
```

**使用方式：**
```typescript
import { PageContainer } from '@zencore/shared/components'
import { formatDate } from '@zencore/shared/utils'
import type { ApiResponse } from '@zencore/shared/types'
```

### Phase 3: 迁移页面代码

#### 租户后台迁移清单：
- [ ] 从 admin/src/views/tenant/ 迁移内容管理页面
- [ ] 从 admin/src/views/tenant/ 迁移模板管理页面
- [ ] 从 admin/src/views/tenant/ 迁移订阅管理页面
- [ ] 从 admin/src/store/ 迁移 content.ts
- [ ] 从 admin/src/store/ 迁移 template.ts
- [ ] 从 admin/src/store/ 迁移 subscription.ts

#### 代理商后台迁移清单：
- [ ] 从 admin/src/views/agent/ 迁移客户管理页面
- [ ] 从 admin/src/views/agent/ 迁移佣金管理页面
- [ ] 从 admin/src/store/ 迁移 agent.ts

#### 开发者后台新建清单：
- [ ] 创建模板管理页面
- [ ] 创建收益统计页面
- [ ] 创建用户评价页面
- [ ] 创建开发文档页面

### Phase 4: 更新配置

#### Docker Compose
```yaml
services:
  admin-frontend:
    build: ./frontend/admin
    ports:
      - "80:80"
    environment:
      - VITE_APP_TITLE=管理后台

  tenant-frontend:
    build: ./frontend/tenant
    ports:
      - "81:80"
    environment:
      - VITE_APP_TITLE=租户后台

  agent-frontend:
    build: ./frontend/agent
    ports:
      - "82:80"
    environment:
      - VITE_APP_TITLE=代理商后台

  developer-frontend:
    build: ./frontend/developer
    ports:
      - "83:80"
    environment:
      - VITE_APP_TITLE=开发者后台
```

#### Nginx 配置
```nginx
# 管理后台
server {
    listen 80;
    server_name admin.zencore.com;
    root /usr/share/nginx/html/admin;
}

# 租户后台
server {
    listen 80;
    server_name app.zencore.com;
    root /usr/share/nginx/html/tenant;
}

# 代理商后台
server {
    listen 80;
    server_name agent.zencore.com;
    root /usr/share/nginx/html/agent;
}

# 开发者后台
server {
    listen 80;
    server_name developer.zencore.com;
    root /usr/share/nginx/html/developer;
}
```

### Phase 5: 测试与部署

- [ ] 本地开发环境测试
- [ ] 构建测试
- [ ] 生产环境部署

## 💡 优势对比

### 重构前（单体架构）

| 指标 | 数值 |
|------|------|
| 项目数量 | 1个 |
| 打包大小 | ~2.5MB（所有角色） |
| 首屏加载 | 较慢（加载所有代码） |
| 代码耦合 | 高 |
| 维护难度 | 高 |
| 安全性 | 低（代码都在客户端） |

### 重构后（独立项目）

| 指标 | 数值 |
|------|------|
| 项目数量 | 4个 |
| 打包大小 | ~800KB/项目 |
| 首屏加载 | 快（按需加载） |
| 代码耦合 | 低 |
| 维护难度 | 低 |
| 安全性 | 高（代码完全隔离） |

## 🚀 快速开始

### 安装依赖

```bash
# 租户后台
cd frontend/tenant
npm install

# 代理商后台
cd frontend/agent
npm install

# 开发者后台
cd frontend/developer
npm install
```

### 开发模式

```bash
# 同时启动所有前端项目（需在项目根目录）
npm run dev:all

# 或单独启动
cd frontend/tenant && npm run dev      # http://localhost:5174
cd frontend/agent && npm run dev       # http://localhost:5175
cd frontend/developer && npm run dev   # http://localhost:5176
cd frontend/admin && npm run dev       # http://localhost:5173
```

### 构建生产版本

```bash
# 构建所有前端项目
npm run build:all

# 或单独构建
cd frontend/tenant && npm run build
cd frontend/agent && npm run build
cd frontend/developer && npm run build
cd frontend/admin && npm run build
```

## 📝 后续计划

### 短期（1-2周）
1. ✅ 创建项目基础结构（已完成）
2. ✅ 完成核心配置文件（已完成）
3. 📝 提取共享代码
4. 📝 迁移现有页面

### 中期（2-4周）
1. 📝 完善各后台功能
2. 📝 统一设计风格
3. 📝 性能优化
4. 📝 编写测试

### 长期（1-2月）
1. 📝 微前端架构探索
2. 📝 组件库建设
3. 📝 工程化完善

## ⚠️ 注意事项

1. **API兼容性**
   - 确保后端API支持不同角色的权限验证
   - Token中需包含角色信息

2. **状态共享**
   - 不同项目间不共享状态
   - 通过LocalStorage或SessionStorage共享必要信息

3. **样式一致性**
   - 建议使用共享的设计Token
   - Element Plus主题统一配置

4. **部署策略**
   - 可以独立部署，也可以放在不同路径
   - 建议使用子域名区分

## 📞 技术支持

如有问题，请参考：
- [前端开发指南](./FRONTEND_GUIDE.md)
- [API使用文档](../api/API_GUIDE.md)
- GitHub Issues

---

**当前状态**: Phase 1 - 基础结构创建完成
**更新时间**: 2024-11-18
**负责人**: Development Team
