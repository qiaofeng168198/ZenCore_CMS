# API 使用指南

## 基础信息

- **Base URL**: `http://localhost:3000/api/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证

### 登录

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "userType": "super_admin"
    }
  }
}
```

### 使用Token

在后续请求中，在Header中添加：

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 租户管理

### 获取租户列表

```http
GET /tenants?page=1&pageSize=10&keyword=test&status=active
```

响应：

```json
{
  "code": 200,
  "data": {
    "data": [
      {
        "id": 1,
        "name": "测试租户",
        "slug": "test-tenant",
        "domain": "test.example.com",
        "status": "active",
        "contactName": "张三",
        "contactEmail": "zhangsan@example.com",
        "contactPhone": "13800138000",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100
  }
}
```

### 创建租户

```http
POST /tenants
Content-Type: application/json

{
  "name": "新租户",
  "slug": "new-tenant",
  "domain": "new.example.com",
  "contactName": "李四",
  "contactEmail": "lisi@example.com",
  "contactPhone": "13900139000",
  "description": "租户描述"
}
```

### 更新租户

```http
PUT /tenants/1
Content-Type: application/json

{
  "name": "更新后的租户名",
  "status": "suspended"
}
```

### 删除租户

```http
DELETE /tenants/1
```

## 内容管理

### 获取内容列表

```http
GET /contents?page=1&pageSize=10&status=published&keyword=文章
```

查询参数：
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `status`: 状态过滤（draft, pending, published, offline）
- `keyword`: 关键词搜索
- `categoryId`: 分类ID
- `language`: 语言

响应：

```json
{
  "code": 200,
  "data": {
    "data": [
      {
        "id": 1,
        "title": "文章标题",
        "slug": "article-slug",
        "content": "文章内容...",
        "status": "published",
        "contentType": "richtext",
        "viewCount": 100,
        "likeCount": 50,
        "version": 2,
        "publishedAt": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 50
  }
}
```

### 创建内容

```http
POST /contents
Content-Type: application/json

{
  "title": "新文章",
  "slug": "new-article",
  "content": "文章内容...",
  "contentType": "richtext",
  "excerpt": "摘要",
  "featuredImage": "https://example.com/image.jpg"
}
```

### 获取内容详情

```http
GET /contents/1
```

### 更新内容

```http
PATCH /contents/1
Content-Type: application/json

{
  "title": "更新后的标题",
  "content": "更新后的内容"
}
```

### 发布内容

```http
POST /contents/1/publish
```

### 下线内容

```http
POST /contents/1/offline
```

### 提交审核

```http
POST /contents/1/submit
```

### 获取版本历史

```http
GET /contents/1/versions
```

### 回滚版本

```http
POST /contents/1/rollback/2
```

## 模板管理

### 获取模板列表

```http
GET /templates?status=active
```

### 获取模板市场

```http
GET /templates/market
```

### 获取模板详情

```http
GET /templates/1
```

### 创建模板

```http
POST /templates
Content-Type: application/json

{
  "name": "新模板",
  "code": "new-template",
  "description": "模板描述",
  "version": "1.0.0",
  "price": 99.99,
  "isFree": false,
  "category": "blog",
  "previewUrl": "https://example.com/preview"
}
```

### 提交审核

```http
POST /templates/1/submit
```

### 审核模板

```http
POST /templates/1/audit
Content-Type: application/json

{
  "approved": true,
  "comment": "审核通过"
}
```

### 安装模板

```http
POST /templates/1/install
```

### 卸载模板

```http
POST /templates/1/uninstall
```

### 模板评分

```http
POST /templates/1/rate
Content-Type: application/json

{
  "score": 5
}
```

## 代理管理

### 获取代理列表

```http
GET /agents?page=1&pageSize=10&level=province
```

查询参数：
- `level`: 代理级别（province, city, district, partner）
- `parentId`: 上级代理ID
- `keyword`: 关键词搜索
- `province`: 省份
- `city`: 城市

### 创建代理

```http
POST /agents
Content-Type: application/json

{
  "name": "代理商名称",
  "code": "AGENT001",
  "level": "city",
  "parentId": 1,
  "contactName": "王五",
  "contactPhone": "13700137000",
  "contactEmail": "wangwu@example.com",
  "regionProvince": "广东省",
  "regionCity": "深圳市",
  "commissionRate": 10.5
}
```

### 获取代理客户

```http
GET /agents/1/customers?page=1&pageSize=10
```

### 获取代理佣金

```http
GET /agents/1/commissions?page=1&pageSize=10
```

### 获取代理统计

```http
GET /agents/1/stats
```

响应：

```json
{
  "code": 200,
  "data": {
    "totalCustomers": 50,
    "activeCustomers": 45,
    "totalRevenue": 100000,
    "totalCommission": 10000,
    "monthlyRevenue": 10000,
    "monthlyCommission": 1000
  }
}
```

### 获取代理层级树

```http
GET /agents/tree?parentId=1
```

### 获取佣金列表

```http
GET /agents/commissions?page=1&pageSize=10
```

### 申请提现

```http
POST /agents/withdrawal
Content-Type: application/json

{
  "amount": 1000
}
```

## 订阅管理

### 获取套餐列表

```http
GET /subscriptions/plans?activeOnly=true
```

响应：

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "基础版",
      "code": "basic",
      "monthlyPrice": 99,
      "yearlyPrice": 999,
      "maxUsers": 10,
      "maxStorage": 10737418240,
      "maxBandwidth": 107374182400,
      "maxContents": 1000,
      "customDomain": false,
      "apiAccess": true,
      "status": "active"
    }
  ]
}
```

### 订阅套餐

```http
POST /subscriptions/subscribe
Content-Type: application/json

{
  "planId": 1,
  "billingCycle": "monthly"
}
```

### 获取当前订阅

```http
GET /subscriptions/current
```

响应：

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "tenantId": 1,
    "planId": 1,
    "plan": {
      "id": 1,
      "name": "基础版",
      "monthlyPrice": 99
    },
    "billingCycle": "monthly",
    "status": "active",
    "startDate": "2024-01-01",
    "endDate": "2024-02-01",
    "autoRenew": true,
    "currentUsers": 5,
    "currentStorage": 1073741824,
    "currentBandwidth": 10737418240
  }
}
```

### 变更套餐

```http
POST /subscriptions/change-plan
Content-Type: application/json

{
  "planId": 2
}
```

### 取消订阅

```http
POST /subscriptions/cancel
```

### 设置自动续费

```http
POST /subscriptions/auto-renew
Content-Type: application/json

{
  "autoRenew": true
}
```

### 获取订阅历史

```http
GET /subscriptions/history?page=1&pageSize=10
```

## 支付管理

### 获取订单列表

```http
GET /payments/orders?page=1&pageSize=10&status=paid
```

### 创建订单

```http
POST /payments/orders
Content-Type: application/json

{
  "orderType": "subscription",
  "amount": 99,
  "relatedId": 1
}
```

### 支付订单

```http
POST /payments/orders/1/pay
Content-Type: application/json

{
  "paymentMethod": "alipay"
}
```

### 获取支付记录

```http
GET /payments/records?page=1&pageSize=10
```

## 数据统计

### 获取概览统计

```http
GET /stats/overview
```

响应：

```json
{
  "code": 200,
  "data": {
    "totalTenants": 100,
    "totalUsers": 1000,
    "totalContents": 5000,
    "totalRevenue": 100000,
    "activeSubscriptions": 80,
    "todayVisits": 1000
  }
}
```

### 获取趋势数据

```http
GET /stats/trends?startDate=2024-01-01&endDate=2024-01-31&type=revenue
```

### 获取排行榜

```http
GET /stats/rankings?type=content&limit=10
```

## 文件上传

### 上传文件

```http
POST /upload
Content-Type: multipart/form-data

file: [binary data]
```

响应：

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "filename": "image.jpg",
    "url": "https://cdn.example.com/files/image.jpg",
    "mimeType": "image/jpeg",
    "size": 102400,
    "storageType": "oss"
  }
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token无效或过期） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源不存在 |
| 409 | 冲突（如重复创建） |
| 422 | 验证失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

## 错误响应格式

```json
{
  "code": 400,
  "message": "参数验证失败",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ],
  "timestamp": 1704067200000
}
```

## 分页规范

### 请求参数

- `page`: 页码（从1开始）
- `pageSize`: 每页数量（默认10，最大100）

### 响应格式

```json
{
  "code": 200,
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

## 排序和过滤

### 排序

```http
GET /contents?sortBy=createdAt&sortOrder=desc
```

- `sortBy`: 排序字段
- `sortOrder`: 排序方向（asc, desc）

### 过滤

```http
GET /contents?status=published&categoryId=1&createdAfter=2024-01-01
```

## 最佳实践

### 1. 使用正确的HTTP方法

- `GET`: 获取资源
- `POST`: 创建资源
- `PUT/PATCH`: 更新资源
- `DELETE`: 删除资源

### 2. Token刷新

Token过期前应主动刷新：

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "..."
}
```

### 3. 批量操作

```http
POST /contents/batch-delete
Content-Type: application/json

{
  "ids": [1, 2, 3, 4, 5]
}
```

### 4. 字段筛选

只返回需要的字段：

```http
GET /users?fields=id,username,email
```

### 5. 关联数据加载

```http
GET /contents?include=author,category
```

## 速率限制

- 未认证请求: 60次/小时
- 已认证请求: 1000次/小时
- 超出限制返回 429 状态码

响应头包含限制信息：

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1704067200
```

## WebSocket 实时通知

连接地址：

```
ws://localhost:3000/ws
```

认证：

```json
{
  "type": "auth",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

接收通知：

```json
{
  "type": "notification",
  "data": {
    "id": 1,
    "title": "新订单",
    "content": "您有新的订单",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Swagger 文档

访问完整的 Swagger API 文档：

```
http://localhost:3000/api/docs
```

## Postman Collection

导入 Postman Collection 快速测试：

```bash
# 导出Collection
curl -o postman_collection.json http://localhost:3000/api/docs-json
```

## SDK

### JavaScript/TypeScript

```typescript
import { ZenCoreClient } from '@zencore/sdk'

const client = new ZenCoreClient({
  baseURL: 'http://localhost:3000/api/v1',
  token: 'your-token'
})

// 获取租户列表
const tenants = await client.tenants.list({ page: 1, pageSize: 10 })

// 创建内容
const content = await client.contents.create({
  title: '新文章',
  content: '内容...'
})
```

## 常见问题

### 1. CORS 错误

确保后端已配置CORS：

```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true
})
```

### 2. Token 过期

Token过期时返回401，前端应跳转到登录页或刷新Token。

### 3. 文件上传大小限制

默认限制为10MB，可在后端配置：

```typescript
// main.ts
app.use(json({ limit: '10mb' }))
```

## 技术支持

- 文档: https://docs.zencore.com
- 问题反馈: https://github.com/zencore/cms/issues
- 邮件: support@zencore.com
