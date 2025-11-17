<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <span>总用户数</span>
          </template>
          <div class="stat-number">1,234</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <span>总租户数</span>
          </template>
          <div class="stat-number">56</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <span>总内容数</span>
          </template>
          <div class="stat-number">8,910</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <span>今日访问</span>
          </template>
          <div class="stat-number">3,456</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top: 20px;">
      <template #header>
        <span>欢迎使用 ZenCore CMS</span>
      </template>
      <el-empty description="仪表盘功能开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.dashboard {
  .stat-number {
    font-size: 32px;
    font-weight: 600;
    color: #409eff;
    text-align: center;
    padding: 20px 0;
  }
}
</style>
