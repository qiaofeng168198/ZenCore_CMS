# ZenCore CMS 监控告警系统

## 概述

完整的监控告警系统，包含健康检查、性能监控、告警通知和日志追踪功能。

## 系统架构

```
┌──────────────┐
│   应用服务    │ ──── Metrics ───▶
└──────────────┘                  │
                                  ▼
┌──────────────┐           ┌──────────────┐
│  Exporters   │ ────────▶ │  Prometheus  │
│ - Node       │           │              │
│ - MySQL      │           └──────┬───────┘
│ - Redis      │                  │
└──────────────┘                  │ Query
                                  ▼
                          ┌──────────────┐
                          │   Grafana    │ ◀── 可视化仪表板
                          └──────────────┘
                                  │
                          ┌───────▼───────┐
                          │ AlertManager  │ ◀── 告警路由
                          └───────┬───────┘
                                  │
                      ┌───────────┼───────────┐
                      ▼           ▼           ▼
                   Email      Webhook        SMS
```

## 核心功能

### 1. 健康检查

- **端点**: `GET /monitoring/health`
- **功能**:
  - 数据库连接检查
  - 应用服务健康状态
  - 依赖服务检查

### 2. 系统指标

- **CPU使用率**: 实时CPU占用监控
- **内存使用率**: 内存使用情况跟踪
- **磁盘使用率**: 磁盘空间监控
- **进程指标**: Node.js进程内存和CPU
- **数据库指标**: 连接池、查询性能

### 3. 性能监控

- **HTTP请求监控**:
  - 请求率 (RPS)
  - 响应时间分布 (P50/P95/P99)
  - 错误率统计
  - 请求/响应大小

- **业务指标**:
  - 活跃用户数
  - 活跃租户数
  - 内容总数
  - 订单总数

### 4. 告警系统

#### 告警规则

| 告警名称 | 触发条件 | 严重程度 | 持续时间 |
|---------|---------|---------|---------|
| HighResponseTime | P95 > 1000ms | Warning | 5分钟 |
| HighErrorRate | 5xx错误 > 5% | Critical | 3分钟 |
| ApplicationDown | 服务不可用 | Critical | 1分钟 |
| HighMemoryUsage | 内存 > 85% | Warning | 5分钟 |
| HighCPUUsage | CPU > 80% | Warning | 5分钟 |
| DatabaseDown | MySQL不可用 | Critical | 1分钟 |

#### 通知渠道

- **邮件通知**: 支持SMTP配置
- **Webhook**: HTTP回调通知
- **短信通知**: 可集成短信服务

### 5. 日志系统

- **日志级别**: ERROR, WARN, INFO, DEBUG
- **日志存储**:
  - 数据库存储（错误和警告）
  - 文件存储（所有级别）
  - 日志轮转（按日期）
- **日志保留**:
  - 文件日志: 14天（普通），30天（错误）
  - 数据库日志: 90天

## 部署指南

### 1. 启动监控服务

```bash
# 启动完整监控栈
docker-compose up -d prometheus grafana alertmanager

# 启动Exporters
docker-compose up -d node-exporter mysql-exporter redis-exporter
```

### 2. 访问监控服务

| 服务 | URL | 默认账号 |
|------|-----|---------|
| Grafana | http://localhost:3001 | admin/admin |
| Prometheus | http://localhost:9090 | - |
| AlertManager | http://localhost:9093 | - |
| 应用健康检查 | http://localhost:3000/monitoring/health | - |
| 应用指标 | http://localhost:3000/monitoring/metrics | - |

### 3. 配置告警

编辑 `monitoring/alertmanager/alertmanager.yml`:

```yaml
global:
  smtp_from: 'alerts@your-domain.com'
  smtp_smarthost: 'smtp.your-provider.com:587'
  smtp_auth_username: 'your-username'
  smtp_auth_password: 'your-password'

receivers:
  - name: 'critical-alerts'
    email_configs:
      - to: 'ops@your-domain.com'
```

### 4. 导入Grafana仪表板

1. 登录Grafana (http://localhost:3001)
2. 导航到 Configuration → Data Sources
3. 添加Prometheus数据源 (http://prometheus:9090)
4. 导入仪表板 JSON 文件: `monitoring/grafana/dashboards/application-overview.json`

## API端点

### 健康检查

```bash
GET /monitoring/health
```

### 系统指标

```bash
GET /monitoring/system/metrics       # 系统指标
GET /monitoring/database/metrics     # 数据库指标
GET /monitoring/application/metrics  # 应用指标
```

### Prometheus指标

```bash
GET /monitoring/metrics              # Prometheus格式
GET /monitoring/metrics/json         # JSON格式
```

### 告警管理

```bash
GET /monitoring/alerts                      # 告警列表
POST /monitoring/alerts/:id/acknowledge     # 确认告警
POST /monitoring/alerts/:id/resolve         # 解决告警
GET /monitoring/alerts/stats                # 告警统计
```

### 日志查询

```bash
GET /monitoring/logs                 # 日志列表
GET /monitoring/logs/stats           # 日志统计
GET /monitoring/logs/errors          # 错误日志搜索
```

## 自定义指标

### 记录业务指标

```typescript
import { MetricsService } from './modules/monitoring/metrics.service';

@Injectable()
export class YourService {
  constructor(private metricsService: MetricsService) {}

  async someMethod() {
    // 更新业务指标
    this.metricsService.updateBusinessMetrics({
      activeUsers: 100,
      totalOrders: 1000,
    });
  }
}
```

### 创建自定义告警

```typescript
import { AlertService } from './modules/monitoring/alert.service';

@Injectable()
export class YourService {
  constructor(private alertService: AlertService) {}

  async detectAnomaly() {
    await this.alertService.createAlert({
      type: 'custom_anomaly',
      severity: AlertSeverity.WARNING,
      message: '检测到异常行为',
      timestamp: new Date(),
      metadata: { /* 额外数据 */ },
    });
  }
}
```

## 性能优化建议

### 1. 指标收集优化

- 合理设置采集间隔（推荐15s）
- 只收集必要的指标
- 使用标签过滤减少数据量

### 2. 告警优化

- 设置合理的告警阈值
- 使用抑制规则避免告警风暴
- 配置告警分组和去重

### 3. 日志优化

- ERROR级别自动保存到数据库
- WARN级别选择性保存
- INFO和DEBUG仅保存到文件
- 定期清理旧日志

## 故障排查

### 问题: Prometheus无法抓取指标

**解决方案**:
1. 检查应用是否正常运行
2. 确认 `/monitoring/metrics` 端点可访问
3. 检查防火墙和网络配置
4. 查看Prometheus日志: `docker logs zencore_prometheus`

### 问题: 告警未收到通知

**解决方案**:
1. 检查AlertManager配置
2. 验证SMTP服务器配置
3. 查看AlertManager日志
4. 测试告警规则: `amtool check-config`

### 问题: Grafana无法连接Prometheus

**解决方案**:
1. 确认Prometheus正常运行
2. 检查数据源URL配置
3. 使用容器内网络: `http://prometheus:9090`

## 维护任务

### 定期任务

- **每日**: 检查告警状态，处理未解决告警
- **每周**: 审查系统性能指标，调整阈值
- **每月**: 清理旧日志和告警记录，优化存储

### 备份

```bash
# 备份Prometheus数据
docker exec zencore_prometheus tar czf /tmp/prometheus-backup.tar.gz /prometheus

# 备份Grafana仪表板
docker exec zencore_grafana tar czf /tmp/grafana-backup.tar.gz /var/lib/grafana
```

## 参考资料

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [NestJS Health Checks](https://docs.nestjs.com/recipes/terminus)
- [Prom-client](https://github.com/siimon/prom-client)
