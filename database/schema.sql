-- ZenCore CMS 数据库设计
-- MySQL 8.0+
-- 字符集: utf8mb4

-- ==========================================
-- 1. 租户管理相关表
-- ==========================================

-- 租户表
CREATE TABLE `tenants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '租户ID',
  `name` VARCHAR(100) NOT NULL COMMENT '租户名称',
  `code` VARCHAR(50) NOT NULL COMMENT '租户代码(唯一标识)',
  `status` ENUM('active', 'suspended', 'expired', 'deleted') NOT NULL DEFAULT 'active' COMMENT '状态',
  `domain` VARCHAR(255) DEFAULT NULL COMMENT '自定义域名',
  `subdomain` VARCHAR(100) DEFAULT NULL COMMENT '子域名',
  `logo` VARCHAR(500) DEFAULT NULL COMMENT 'Logo URL',
  `contact_name` VARCHAR(50) DEFAULT NULL COMMENT '联系人姓名',
  `contact_email` VARCHAR(100) DEFAULT NULL COMMENT '联系人邮箱',
  `contact_phone` VARCHAR(20) DEFAULT NULL COMMENT '联系人电话',
  `agent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '所属代理商ID',
  `expired_at` DATETIME DEFAULT NULL COMMENT '过期时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  UNIQUE KEY `uk_domain` (`domain`),
  UNIQUE KEY `uk_subdomain` (`subdomain`),
  KEY `idx_agent_id` (`agent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户表';

-- 租户配额表
CREATE TABLE `tenant_quotas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '配额ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `quota_type` ENUM('storage', 'bandwidth', 'users', 'contents', 'api_calls') NOT NULL COMMENT '配额类型',
  `quota_limit` BIGINT NOT NULL DEFAULT 0 COMMENT '配额限制',
  `quota_used` BIGINT NOT NULL DEFAULT 0 COMMENT '已使用配额',
  `reset_cycle` ENUM('daily', 'monthly', 'yearly', 'never') NOT NULL DEFAULT 'monthly' COMMENT '重置周期',
  `last_reset_at` DATETIME DEFAULT NULL COMMENT '上次重置时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_quota` (`tenant_id`, `quota_type`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户配额表';

-- 租户配置表
CREATE TABLE `tenant_configs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `config_key` VARCHAR(100) NOT NULL COMMENT '配置键',
  `config_value` TEXT COMMENT '配置值(JSON)',
  `config_type` ENUM('system', 'theme', 'seo', 'custom') NOT NULL DEFAULT 'custom' COMMENT '配置类型',
  `is_encrypted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否加密',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_config` (`tenant_id`, `config_key`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户配置表';

-- ==========================================
-- 2. 用户管理相关表
-- ==========================================

-- 用户表
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `tenant_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '租户ID(NULL表示平台用户)',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `email` VARCHAR(100) NOT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `status` ENUM('active', 'disabled', 'locked') NOT NULL DEFAULT 'active' COMMENT '状态',
  `user_type` ENUM('super_admin', 'agent', 'tenant_admin', 'tenant_user', 'developer') NOT NULL COMMENT '用户类型',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
  `login_failed_count` INT NOT NULL DEFAULT 0 COMMENT '登录失败次数',
  `locked_until` DATETIME DEFAULT NULL COMMENT '锁定至',
  `two_factor_enabled` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否启用双因素认证',
  `two_factor_secret` VARCHAR(255) DEFAULT NULL COMMENT '双因素认证密钥',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_user_type` (`user_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 角色表
CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `tenant_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '租户ID(NULL表示系统角色)',
  `name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `code` VARCHAR(50) NOT NULL COMMENT '角色代码',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '角色描述',
  `is_system` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否系统角色',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_code` (`tenant_id`, `code`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 权限表
CREATE TABLE `permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  `name` VARCHAR(100) NOT NULL COMMENT '权限名称',
  `code` VARCHAR(100) NOT NULL COMMENT '权限代码',
  `resource` VARCHAR(100) NOT NULL COMMENT '资源',
  `action` VARCHAR(50) NOT NULL COMMENT '操作',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '权限描述',
  `module` VARCHAR(50) DEFAULT NULL COMMENT '所属模块',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='权限表';

-- 用户角色关联表
CREATE TABLE `user_roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- 角色权限关联表
CREATE TABLE `role_permissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `permission_id` BIGINT UNSIGNED NOT NULL COMMENT '权限ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_permission` (`role_id`, `permission_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_permission_id` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限关联表';

-- ==========================================
-- 3. 内容管理相关表
-- ==========================================

-- 内容分类表
CREATE TABLE `content_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父分类ID',
  `name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `slug` VARCHAR(100) NOT NULL COMMENT 'URL别名',
  `description` TEXT COMMENT '分类描述',
  `icon` VARCHAR(255) DEFAULT NULL COMMENT '图标',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_slug` (`tenant_id`, `slug`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容分类表';

-- 内容表
CREATE TABLE `contents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '内容ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `category_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '分类ID',
  `title` VARCHAR(255) NOT NULL COMMENT '标题',
  `slug` VARCHAR(255) NOT NULL COMMENT 'URL别名',
  `summary` TEXT COMMENT '摘要',
  `content` LONGTEXT COMMENT '内容',
  `content_type` ENUM('richtext', 'markdown', 'html') NOT NULL DEFAULT 'richtext' COMMENT '内容类型',
  `cover_image` VARCHAR(500) DEFAULT NULL COMMENT '封面图',
  `author_id` BIGINT UNSIGNED NOT NULL COMMENT '作者ID',
  `status` ENUM('draft', 'pending', 'published', 'offline') NOT NULL DEFAULT 'draft' COMMENT '状态',
  `publish_at` DATETIME DEFAULT NULL COMMENT '发布时间',
  `offline_at` DATETIME DEFAULT NULL COMMENT '下线时间',
  `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `like_count` INT NOT NULL DEFAULT 0 COMMENT '点赞次数',
  `is_top` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否置顶',
  `is_recommended` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否推荐',
  `seo_title` VARCHAR(255) DEFAULT NULL COMMENT 'SEO标题',
  `seo_keywords` VARCHAR(255) DEFAULT NULL COMMENT 'SEO关键词',
  `seo_description` TEXT DEFAULT NULL COMMENT 'SEO描述',
  `language` VARCHAR(10) NOT NULL DEFAULT 'zh-CN' COMMENT '语言',
  `version` INT NOT NULL DEFAULT 1 COMMENT '版本号',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_slug` (`tenant_id`, `slug`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_author_id` (`author_id`),
  KEY `idx_status` (`status`),
  KEY `idx_publish_at` (`publish_at`),
  KEY `idx_language` (`language`),
  FULLTEXT KEY `ft_title_content` (`title`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容表';

-- 内容版本表
CREATE TABLE `content_versions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  `content_id` BIGINT UNSIGNED NOT NULL COMMENT '内容ID',
  `version` INT NOT NULL COMMENT '版本号',
  `title` VARCHAR(255) NOT NULL COMMENT '标题',
  `summary` TEXT COMMENT '摘要',
  `content` LONGTEXT COMMENT '内容',
  `content_type` ENUM('richtext', 'markdown', 'html') NOT NULL DEFAULT 'richtext' COMMENT '内容类型',
  `created_by` BIGINT UNSIGNED NOT NULL COMMENT '创建人ID',
  `change_log` TEXT COMMENT '变更日志',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_content_id` (`content_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容版本表';

-- 内容审核表
CREATE TABLE `content_audits` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '审核ID',
  `content_id` BIGINT UNSIGNED NOT NULL COMMENT '内容ID',
  `auditor_id` BIGINT UNSIGNED NOT NULL COMMENT '审核人ID',
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态',
  `comment` TEXT COMMENT '审核意见',
  `audited_at` DATETIME DEFAULT NULL COMMENT '审核时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_content_id` (`content_id`),
  KEY `idx_auditor_id` (`auditor_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容审核表';

-- 内容标签表
CREATE TABLE `content_tags` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `slug` VARCHAR(50) NOT NULL COMMENT 'URL别名',
  `use_count` INT NOT NULL DEFAULT 0 COMMENT '使用次数',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_slug` (`tenant_id`, `slug`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容标签表';

-- 内容标签关联表
CREATE TABLE `content_tag_relations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `content_id` BIGINT UNSIGNED NOT NULL COMMENT '内容ID',
  `tag_id` BIGINT UNSIGNED NOT NULL COMMENT '标签ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_content_tag` (`content_id`, `tag_id`),
  KEY `idx_content_id` (`content_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容标签关联表';

-- ==========================================
-- 4. 模板系统相关表
-- ==========================================

-- 模板表
CREATE TABLE `templates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '模板ID',
  `developer_id` BIGINT UNSIGNED NOT NULL COMMENT '开发者ID',
  `name` VARCHAR(100) NOT NULL COMMENT '模板名称',
  `code` VARCHAR(50) NOT NULL COMMENT '模板代码',
  `description` TEXT COMMENT '模板描述',
  `version` VARCHAR(20) NOT NULL COMMENT '版本号',
  `cover_image` VARCHAR(500) DEFAULT NULL COMMENT '封面图',
  `preview_url` VARCHAR(500) DEFAULT NULL COMMENT '预览URL',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '价格',
  `is_free` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否免费',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类',
  `tags` VARCHAR(255) DEFAULT NULL COMMENT '标签(逗号分隔)',
  `status` ENUM('draft', 'pending', 'approved', 'rejected', 'offline') NOT NULL DEFAULT 'draft' COMMENT '状态',
  `is_responsive` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否响应式',
  `support_mobile` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否支持移动端',
  `support_miniprogram` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否支持小程序',
  `download_count` INT NOT NULL DEFAULT 0 COMMENT '下载次数',
  `rating_score` DECIMAL(3,2) NOT NULL DEFAULT 0.00 COMMENT '评分',
  `rating_count` INT NOT NULL DEFAULT 0 COMMENT '评价数',
  `file_path` VARCHAR(500) DEFAULT NULL COMMENT '文件路径',
  `file_size` BIGINT DEFAULT NULL COMMENT '文件大小(字节)',
  `commission_rate` DECIMAL(5,2) NOT NULL DEFAULT 30.00 COMMENT '佣金比例(%)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_developer_id` (`developer_id`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模板表';

-- 模板版本表
CREATE TABLE `template_versions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  `template_id` BIGINT UNSIGNED NOT NULL COMMENT '模板ID',
  `version` VARCHAR(20) NOT NULL COMMENT '版本号',
  `change_log` TEXT COMMENT '更新日志',
  `file_path` VARCHAR(500) NOT NULL COMMENT '文件路径',
  `file_size` BIGINT NOT NULL COMMENT '文件大小(字节)',
  `download_count` INT NOT NULL DEFAULT 0 COMMENT '下载次数',
  `status` ENUM('active', 'deprecated') NOT NULL DEFAULT 'active' COMMENT '状态',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_template_version` (`template_id`, `version`),
  KEY `idx_template_id` (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模板版本表';

-- 租户模板关联表
CREATE TABLE `tenant_templates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `template_id` BIGINT UNSIGNED NOT NULL COMMENT '模板ID',
  `is_active` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否当前使用',
  `purchased_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '购买时间',
  `expired_at` DATETIME DEFAULT NULL COMMENT '过期时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_template_id` (`template_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户模板关联表';

-- 模板审核表
CREATE TABLE `template_audits` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '审核ID',
  `template_id` BIGINT UNSIGNED NOT NULL COMMENT '模板ID',
  `auditor_id` BIGINT UNSIGNED NOT NULL COMMENT '审核人ID',
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态',
  `comment` TEXT COMMENT '审核意见',
  `audited_at` DATETIME DEFAULT NULL COMMENT '审核时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_template_id` (`template_id`),
  KEY `idx_auditor_id` (`auditor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模板审核表';

-- 模板评价表
CREATE TABLE `template_ratings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `template_id` BIGINT UNSIGNED NOT NULL COMMENT '模板ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `score` TINYINT NOT NULL COMMENT '评分(1-5)',
  `comment` TEXT COMMENT '评价内容',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_template_user` (`template_id`, `user_id`, `tenant_id`),
  KEY `idx_template_id` (`template_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模板评价表';

-- ==========================================
-- 5. 代理体系相关表
-- ==========================================

-- 代理商表
CREATE TABLE `agents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '代理商ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '关联用户ID',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '上级代理商ID',
  `level` INT NOT NULL DEFAULT 1 COMMENT '代理级别',
  `company_name` VARCHAR(200) DEFAULT NULL COMMENT '公司名称',
  `region` VARCHAR(100) DEFAULT NULL COMMENT '代理区域',
  `status` ENUM('active', 'suspended', 'terminated') NOT NULL DEFAULT 'active' COMMENT '状态',
  `commission_rate` DECIMAL(5,2) NOT NULL DEFAULT 20.00 COMMENT '佣金比例(%)',
  `total_customers` INT NOT NULL DEFAULT 0 COMMENT '客户总数',
  `active_customers` INT NOT NULL DEFAULT 0 COMMENT '活跃客户数',
  `total_revenue` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '总收益',
  `total_commission` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '总佣金',
  `contract_start` DATE DEFAULT NULL COMMENT '合同开始日期',
  `contract_end` DATE DEFAULT NULL COMMENT '合同结束日期',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_level` (`level`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='代理商表';

-- 代理区域表
CREATE TABLE `agent_regions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `agent_id` BIGINT UNSIGNED NOT NULL COMMENT '代理商ID',
  `province` VARCHAR(50) DEFAULT NULL COMMENT '省份',
  `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
  `district` VARCHAR(50) DEFAULT NULL COMMENT '区县',
  `is_exclusive` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否独家代理',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_agent_id` (`agent_id`),
  KEY `idx_region` (`province`, `city`, `district`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='代理区域表';

-- 代理佣金记录表
CREATE TABLE `agent_commissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '佣金ID',
  `agent_id` BIGINT UNSIGNED NOT NULL COMMENT '代理商ID',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `commission_type` ENUM('subscription', 'template', 'value_added') NOT NULL COMMENT '佣金类型',
  `order_amount` DECIMAL(10,2) NOT NULL COMMENT '订单金额',
  `commission_rate` DECIMAL(5,2) NOT NULL COMMENT '佣金比例(%)',
  `commission_amount` DECIMAL(10,2) NOT NULL COMMENT '佣金金额',
  `status` ENUM('pending', 'confirmed', 'paid', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `settled_at` DATETIME DEFAULT NULL COMMENT '结算时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_agent_id` (`agent_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='代理佣金记录表';

-- ==========================================
-- 6. 订阅与计费相关表
-- ==========================================

-- 订阅套餐表
CREATE TABLE `subscription_plans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '套餐ID',
  `name` VARCHAR(100) NOT NULL COMMENT '套餐名称',
  `code` VARCHAR(50) NOT NULL COMMENT '套餐代码',
  `description` TEXT COMMENT '套餐描述',
  `plan_type` ENUM('basic', 'professional', 'enterprise', 'custom') NOT NULL COMMENT '套餐类型',
  `billing_cycle` ENUM('monthly', 'quarterly', 'yearly') NOT NULL COMMENT '计费周期',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `original_price` DECIMAL(10,2) DEFAULT NULL COMMENT '原价',
  `features` JSON COMMENT '套餐功能(JSON)',
  `quotas` JSON COMMENT '配额限制(JSON)',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `is_popular` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否热门',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_plan_type` (`plan_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订阅套餐表';

-- 租户订阅表
CREATE TABLE `tenant_subscriptions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订阅ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `plan_id` BIGINT UNSIGNED NOT NULL COMMENT '套餐ID',
  `status` ENUM('active', 'expired', 'cancelled', 'suspended') NOT NULL DEFAULT 'active' COMMENT '状态',
  `start_at` DATETIME NOT NULL COMMENT '开始时间',
  `end_at` DATETIME NOT NULL COMMENT '结束时间',
  `auto_renew` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否自动续费',
  `cancelled_at` DATETIME DEFAULT NULL COMMENT '取消时间',
  `cancel_reason` TEXT COMMENT '取消原因',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_plan_id` (`plan_id`),
  KEY `idx_status` (`status`),
  KEY `idx_end_at` (`end_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户订阅表';

-- 订单表
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单号',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `order_type` ENUM('subscription', 'template', 'value_added', 'renewal') NOT NULL COMMENT '订单类型',
  `item_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `item_name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '订单金额',
  `discount_amount` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '优惠金额',
  `final_amount` DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  `status` ENUM('pending', 'paid', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending' COMMENT '订单状态',
  `payment_method` VARCHAR(50) DEFAULT NULL COMMENT '支付方式',
  `payment_no` VARCHAR(100) DEFAULT NULL COMMENT '支付流水号',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
  `expired_at` DATETIME DEFAULT NULL COMMENT '过期时间',
  `remark` TEXT COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 发票表
CREATE TABLE `invoices` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '发票ID',
  `invoice_no` VARCHAR(50) NOT NULL COMMENT '发票号',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `invoice_type` ENUM('personal', 'company') NOT NULL COMMENT '发票类型',
  `invoice_title` VARCHAR(200) NOT NULL COMMENT '发票抬头',
  `tax_no` VARCHAR(50) DEFAULT NULL COMMENT '税号',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '发票金额',
  `status` ENUM('pending', 'issued', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `file_url` VARCHAR(500) DEFAULT NULL COMMENT '发票文件URL',
  `issued_at` DATETIME DEFAULT NULL COMMENT '开票时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_invoice_no` (`invoice_no`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_tenant_id` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='发票表';

-- ==========================================
-- 7. 系统管理相关表
-- ==========================================

-- 系统配置表
CREATE TABLE `system_configs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '配置ID',
  `config_key` VARCHAR(100) NOT NULL COMMENT '配置键',
  `config_value` TEXT COMMENT '配置值',
  `config_group` VARCHAR(50) DEFAULT NULL COMMENT '配置分组',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '配置描述',
  `is_encrypted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否加密',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`),
  KEY `idx_config_group` (`config_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 操作日志表
CREATE TABLE `audit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `tenant_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '租户ID',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID',
  `module` VARCHAR(50) NOT NULL COMMENT '模块',
  `action` VARCHAR(50) NOT NULL COMMENT '操作',
  `resource_type` VARCHAR(50) DEFAULT NULL COMMENT '资源类型',
  `resource_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '资源ID',
  `request_method` VARCHAR(10) DEFAULT NULL COMMENT '请求方法',
  `request_url` VARCHAR(500) DEFAULT NULL COMMENT '请求URL',
  `request_ip` VARCHAR(45) DEFAULT NULL COMMENT '请求IP',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT 'User Agent',
  `request_data` JSON COMMENT '请求数据',
  `response_code` INT DEFAULT NULL COMMENT '响应码',
  `error_message` TEXT COMMENT '错误信息',
  `execution_time` INT DEFAULT NULL COMMENT '执行时间(ms)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_module_action` (`module`, `action`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- 文件管理表
CREATE TABLE `files` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `tenant_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '租户ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '上传用户ID',
  `filename` VARCHAR(255) NOT NULL COMMENT '文件名',
  `original_name` VARCHAR(255) NOT NULL COMMENT '原始文件名',
  `file_path` VARCHAR(500) NOT NULL COMMENT '文件路径',
  `file_url` VARCHAR(500) NOT NULL COMMENT '文件URL',
  `file_type` VARCHAR(50) NOT NULL COMMENT '文件类型',
  `file_size` BIGINT NOT NULL COMMENT '文件大小(字节)',
  `mime_type` VARCHAR(100) NOT NULL COMMENT 'MIME类型',
  `storage_type` ENUM('local', 'oss', 'minio', 'cdn') NOT NULL DEFAULT 'local' COMMENT '存储类型',
  `use_type` ENUM('content', 'template', 'avatar', 'other') NOT NULL DEFAULT 'other' COMMENT '用途类型',
  `is_public` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否公开',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_file_type` (`file_type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文件管理表';

-- 通知表
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `tenant_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '租户ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '接收用户ID',
  `type` VARCHAR(50) NOT NULL COMMENT '通知类型',
  `title` VARCHAR(255) NOT NULL COMMENT '通知标题',
  `content` TEXT NOT NULL COMMENT '通知内容',
  `link` VARCHAR(500) DEFAULT NULL COMMENT '链接地址',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已读',
  `read_at` DATETIME DEFAULT NULL COMMENT '阅读时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- 定时任务表
CREATE TABLE `scheduled_tasks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `tenant_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '租户ID',
  `task_type` VARCHAR(50) NOT NULL COMMENT '任务类型',
  `task_name` VARCHAR(100) NOT NULL COMMENT '任务名称',
  `task_data` JSON COMMENT '任务数据',
  `scheduled_at` DATETIME NOT NULL COMMENT '计划执行时间',
  `status` ENUM('pending', 'running', 'completed', 'failed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `executed_at` DATETIME DEFAULT NULL COMMENT '实际执行时间',
  `completed_at` DATETIME DEFAULT NULL COMMENT '完成时间',
  `error_message` TEXT COMMENT '错误信息',
  `retry_count` INT NOT NULL DEFAULT 0 COMMENT '重试次数',
  `max_retry` INT NOT NULL DEFAULT 3 COMMENT '最大重试次数',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_task_type` (`task_type`),
  KEY `idx_status` (`status`),
  KEY `idx_scheduled_at` (`scheduled_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='定时任务表';
