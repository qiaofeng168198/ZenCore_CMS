# ZenCore CMS 部署指南

本文档介绍如何在生产环境中部署 ZenCore CMS。

## 部署方式

### 1. Docker Compose 部署（推荐）

#### 前置要求
- Docker >= 20.x
- Docker Compose >= 2.x
- 2核4GB内存（最小配置）
- 20GB磁盘空间

#### 部署步骤

**1. 下载项目**

```bash
git clone https://github.com/your-org/ZenCore_CMS.git
cd ZenCore_CMS
```

**2. 配置环境变量**

```bash
cp .env.example .env
```

编辑 `.env` 文件，修改以下配置：

```env
# 环境配置
NODE_ENV=production

# 数据库配置
DB_PASSWORD=your-strong-password-here
DB_DATABASE=zencore_cms

# JWT 配置（必须修改为随机字符串，至少32位）
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# MinIO 配置
MINIO_ACCESS_KEY=your-minio-access-key
MINIO_SECRET_KEY=your-minio-secret-key
```

**3. 启动服务**

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

**4. 访问应用**

- 前端管理后台: http://your-server-ip
- 后端API: http://your-server-ip/api
- API文档: http://your-server-ip/api/docs
- MinIO控制台: http://your-server-ip:9001

**5. 创建超级管理员**

首次部署后，需要手动创建超级管理员账户：

```bash
# 进入后端容器
docker exec -it zencore_backend sh

# 使用API创建管理员（或直接插入数据库）
```

#### 维护命令

```bash
# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 停止并删除容器
docker-compose down

# 查看日志
docker-compose logs -f [service_name]

# 更新服务
git pull
docker-compose up -d --build
```

### 2. 手动部署

#### 后端部署

**1. 环境准备**

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 MySQL 8.0
sudo apt-get install -y mysql-server

# 安装 Redis
sudo apt-get install -y redis-server
```

**2. 数据库初始化**

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE zencore_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 创建用户
CREATE USER 'zencore'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON zencore_cms.* TO 'zencore'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 导入数据库结构
mysql -u zencore -p zencore_cms < database/schema.sql
```

**3. 后端部署**

```bash
cd backend

# 安装依赖
npm ci --only=production

# 配置环境变量
cp .env.example .env
nano .env  # 编辑配置文件

# 构建项目
npm run build

# 使用 PM2 启动
npm install -g pm2
pm2 start dist/main.js --name zencore-backend

# 设置开机自启
pm2 startup
pm2 save
```

#### 前端部署

**1. 构建前端**

```bash
cd frontend/admin

# 安装依赖
npm ci

# 构建生产版本
npm run build
```

**2. Nginx 配置**

安装 Nginx：

```bash
sudo apt-get install -y nginx
```

创建配置文件 `/etc/nginx/sites-available/zencore`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/zencore/frontend;
    index index.html;

    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}
```

启用配置：

```bash
# 复制构建文件
sudo mkdir -p /var/www/zencore
sudo cp -r frontend/admin/dist/* /var/www/zencore/frontend/

# 启用站点
sudo ln -s /etc/nginx/sites-available/zencore /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 配置 SSL (Let's Encrypt)

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 性能优化

### 1. 数据库优化

编辑 MySQL 配置 `/etc/mysql/my.cnf`:

```ini
[mysqld]
# 连接池
max_connections=500

# InnoDB 缓冲池
innodb_buffer_pool_size=2G
innodb_log_file_size=512M

# 查询缓存
query_cache_type=1
query_cache_size=256M
```

### 2. Redis 优化

编辑 Redis 配置 `/etc/redis/redis.conf`:

```conf
# 最大内存
maxmemory 1gb
maxmemory-policy allkeys-lru

# 持久化
save 900 1
save 300 10
save 60 10000
```

### 3. Node.js 优化

使用 PM2 集群模式：

```bash
pm2 start dist/main.js -i max --name zencore-backend
```

## 监控与日志

### 1. 应用监控

使用 PM2 监控：

```bash
# 查看进程状态
pm2 status

# 查看日志
pm2 logs zencore-backend

# 监控界面
pm2 monit
```

### 2. 系统监控

推荐使用 Prometheus + Grafana:

```bash
# 安装 Prometheus
docker run -d -p 9090:9090 prom/prometheus

# 安装 Grafana
docker run -d -p 3001:3000 grafana/grafana
```

### 3. 日志管理

日志位置：
- 后端日志: `backend/logs/`
- Nginx日志: `/var/log/nginx/`
- MySQL日志: `/var/log/mysql/`

## 备份策略

### 1. 数据库备份

创建备份脚本 `/opt/backup/mysql-backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/backup/mysql"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u zencore -p'your-password' zencore_cms | gzip > $BACKUP_DIR/zencore_cms_$DATE.sql.gz

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
```

设置定时任务：

```bash
# 编辑 crontab
crontab -e

# 每天凌晨2点备份
0 2 * * * /opt/backup/mysql-backup.sh
```

### 2. 文件备份

```bash
#!/bin/bash
BACKUP_DIR="/opt/backup/files"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/zencore/uploads

# 删除30天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

## 故障排查

### 常见问题

**1. 后端无法连接数据库**

检查数据库配置和网络连接：

```bash
# 测试数据库连接
mysql -h localhost -u zencore -p

# 检查数据库服务状态
sudo systemctl status mysql
```

**2. 前端 404 错误**

检查 Nginx 配置和文件权限：

```bash
# 测试 Nginx 配置
sudo nginx -t

# 检查文件权限
ls -la /var/www/zencore/frontend
```

**3. API 响应慢**

检查数据库慢查询：

```sql
-- 查看慢查询日志
SHOW VARIABLES LIKE 'slow_query%';

-- 查看进程列表
SHOW PROCESSLIST;
```

## 安全加固

### 1. 防火墙配置

```bash
# 安装 ufw
sudo apt-get install -y ufw

# 允许 SSH
sudo ufw allow 22

# 允许 HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# 启用防火墙
sudo ufw enable
```

### 2. 限制访问

- 修改 MySQL 只允许本地访问
- 配置 Redis 密码认证
- 使用强密码策略
- 定期更新系统和依赖包

### 3. 日志审计

启用访问日志和审计日志，定期检查异常访问。

## 扩展部署

### Kubernetes 部署

待补充...

### 负载均衡

待补充...

## 联系支持

如有问题，请联系技术支持：
- Email: support@zencore.com
- GitHub Issues: https://github.com/your-org/ZenCore_CMS/issues
