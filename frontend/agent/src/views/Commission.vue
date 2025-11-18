<template>
  <div class="commission-page">
    <!-- 统计卡片 -->
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="累计佣金" :value="15680">
            <template #prefix>¥</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="本月佣金" :value="3580">
            <template #prefix>¥</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="已提现" :value="12000">
            <template #prefix>¥</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="可提现" :value="3680">
            <template #prefix>¥</template>
          </el-statistic>
          <el-button type="primary" size="small" style="width: 100%; margin-top: 10px">
            申请提现
          </el-button>
        </el-card>
      </el-col>
    </el-row>

    <!-- 佣金记录 -->
    <el-card>
      <template #header>
        <span>佣金记录</span>
      </template>
      <el-table :data="[]" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="customerName" label="客户名称" min-width="150" />
        <el-table-column prop="amount" label="佣金金额" width="120" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="createdAt" label="时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
</style>
