<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <span>总客户数</span>
          </template>
          <div class="stat-number">--</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <span>本月佣金</span>
          </template>
          <div class="stat-number">--</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <span>总收益</span>
          </template>
          <div class="stat-number">--</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <span>团队成员</span>
          </template>
          <div class="stat-number">--</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" style="margin-top: 20px;">
      <template #header>
        <span>欢迎使用代理商后台</span>
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
