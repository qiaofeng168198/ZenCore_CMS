-- ==============================================
-- 数据库性能优化 - 索引优化
-- ==============================================

-- 1. 用户表索引优化
ALTER TABLE `users` ADD INDEX `idx_tenant_status` (`tenant_id`, `status`);
ALTER TABLE `users` ADD INDEX `idx_email` (`email`);
ALTER TABLE `users` ADD INDEX `idx_created_at` (`created_at`);

-- 2. 内容表索引优化
ALTER TABLE `contents` ADD INDEX `idx_tenant_status_type` (`tenant_id`, `status`, `content_type`);
ALTER TABLE `contents` ADD INDEX `idx_author_created` (`author_id`, `created_at`);
ALTER TABLE `contents` ADD INDEX `idx_published_at` (`published_at`);
ALTER TABLE `contents` ADD INDEX `idx_category` (`category`);
ALTER TABLE `contents` ADD INDEX `idx_status_published` (`status`, `published_at`);
ALTER TABLE `contents` ADD INDEX `idx_view_count` (`view_count`);
ALTER TABLE `contents` ADD INDEX `idx_like_count` (`like_count`);

-- 3. 内容版本表索引
ALTER TABLE `content_versions` ADD INDEX `idx_content_version` (`content_id`, `version`);
ALTER TABLE `content_versions` ADD INDEX `idx_created_by` (`created_by`);

-- 4. 模板表索引优化
ALTER TABLE `templates` ADD INDEX `idx_status_category` (`status`, `category`);
ALTER TABLE `templates` ADD INDEX `idx_developer_status` (`developer_id`, `status`);
ALTER TABLE `templates` ADD INDEX `idx_download_count` (`download_count`);
ALTER TABLE `templates` ADD INDEX `idx_rating` (`rating_score`, `rating_count`);
ALTER TABLE `templates` ADD INDEX `idx_created_at` (`created_at`);

-- 5. 代理商表索引
ALTER TABLE `agents` ADD INDEX `idx_parent_status` (`parent_id`, `status`);
ALTER TABLE `agents` ADD INDEX `idx_level` (`level`);
ALTER TABLE `agents` ADD INDEX `idx_region` (`region_province`, `region_city`, `region_district`);
ALTER TABLE `agents` ADD INDEX `idx_code` (`code`);

-- 6. 代理商佣金表索引
ALTER TABLE `agent_commissions` ADD INDEX `idx_agent_status` (`agent_id`, `status`);
ALTER TABLE `agent_commissions` ADD INDEX `idx_order` (`order_id`);
ALTER TABLE `agent_commissions` ADD INDEX `idx_tenant` (`tenant_id`);
ALTER TABLE `agent_commissions` ADD INDEX `idx_created_at` (`created_at`);

-- 7. 订阅计划表索引
ALTER TABLE `subscription_plans` ADD INDEX `idx_status_priority` (`status`, `priority`);
ALTER TABLE `subscription_plans` ADD INDEX `idx_code` (`code`);

-- 8. 租户订阅表索引
ALTER TABLE `tenant_subscriptions` ADD INDEX `idx_tenant_status` (`tenant_id`, `status`);
ALTER TABLE `tenant_subscriptions` ADD INDEX `idx_plan` (`plan_id`);
ALTER TABLE `tenant_subscriptions` ADD INDEX `idx_end_date` (`end_date`, `status`);
ALTER TABLE `tenant_subscriptions` ADD INDEX `idx_auto_renew` (`auto_renew`, `end_date`);

-- 9. 订单表索引
ALTER TABLE `orders` ADD INDEX `idx_tenant_status` (`tenant_id`, `status`);
ALTER TABLE `orders` ADD INDEX `idx_user` (`user_id`);
ALTER TABLE `orders` ADD INDEX `idx_order_no` (`order_no`);
ALTER TABLE `orders` ADD INDEX `idx_type_status` (`order_type`, `status`);
ALTER TABLE `orders` ADD INDEX `idx_paid_at` (`paid_at`);
ALTER TABLE `orders` ADD INDEX `idx_created_at` (`created_at`);

-- 10. 支付记录表索引
ALTER TABLE `payment_records` ADD INDEX `idx_order` (`order_id`);
ALTER TABLE `payment_records` ADD INDEX `idx_payment_no` (`payment_no`);
ALTER TABLE `payment_records` ADD INDEX `idx_transaction` (`transaction_id`);
ALTER TABLE `payment_records` ADD INDEX `idx_status_method` (`status`, `payment_method`);
ALTER TABLE `payment_records` ADD INDEX `idx_created_at` (`created_at`);

-- 11. 告警表索引
ALTER TABLE `alerts` ADD INDEX `idx_type_status` (`type`, `status`);
ALTER TABLE `alerts` ADD INDEX `idx_severity_status` (`severity`, `status`);
ALTER TABLE `alerts` ADD INDEX `idx_created_at` (`created_at`);

-- 12. 系统日志表索引
ALTER TABLE `system_logs` ADD INDEX `idx_level_context` (`level`, `context`);
ALTER TABLE `system_logs` ADD INDEX `idx_created_at` (`created_at`);
ALTER TABLE `system_logs` ADD INDEX `idx_level_created` (`level`, `created_at`);

-- 13. 租户表索引
ALTER TABLE `tenants` ADD INDEX `idx_status` (`status`);
ALTER TABLE `tenants` ADD INDEX `idx_domain` (`domain`);
ALTER TABLE `tenants` ADD INDEX `idx_agent` (`agent_id`);
ALTER TABLE `tenants` ADD INDEX `idx_created_at` (`created_at`);

-- 14. 文件表索引
ALTER TABLE `files` ADD INDEX `idx_tenant_type` (`tenant_id`, `storage_type`);
ALTER TABLE `files` ADD INDEX `idx_use_type` (`use_type`);
ALTER TABLE `files` ADD INDEX `idx_created_at` (`created_at`);

-- ==============================================
-- 复合索引优化说明
-- ==============================================
-- 复合索引的列顺序很重要，遵循以下原则：
-- 1. 等值查询的列放在前面
-- 2. 范围查询的列放在后面
-- 3. 选择性高的列放在前面
-- 4. 经常一起查询的列组合成复合索引

-- ==============================================
-- 索引使用建议
-- ==============================================
-- 1. 定期分析慢查询日志
-- 2. 使用 EXPLAIN 分析查询计划
-- 3. 避免在索引列上使用函数
-- 4. 避免隐式类型转换
-- 5. 合理使用 LIMIT 限制结果集
-- 6. 定期优化表: OPTIMIZE TABLE table_name;
-- 7. 定期更新统计信息: ANALYZE TABLE table_name;
