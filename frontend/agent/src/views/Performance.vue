<template>
  <div class="performance-page">
    <el-card>
      <template #header>
        <span>业绩统计</span>
      </template>

      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="6">
          <el-statistic title="本月新增客户" :value="stats.newCustomers">
            <template #suffix>
              <span style="font-size: 14px">个</span>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="本月佣金收入" :value="stats.commissionIncome">
            <template #prefix>¥</template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="本月续费率" :value="stats.renewalRate">
            <template #suffix>%</template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="团队总人数" :value="stats.teamSize">
            <template #suffix>
              <span style="font-size: 14px">人</span>
            </template>
          </el-statistic>
        </el-col>
      </el-row>

      <el-card shadow="never" style="margin-top: 20px">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <span>佣金趋势</span>
            <el-radio-group v-model="chartPeriod">
              <el-radio-button label="week">最近7天</el-radio-button>
              <el-radio-button label="month">最近30天</el-radio-button>
              <el-radio-button label="year">最近12月</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: #909399">
          图表区域（需集成 ECharts）
        </div>
      </el-card>

      <el-card shadow="never" style="margin-top: 20px">
        <template #header>
          <span>业绩排名</span>
        </template>
        <el-table :data="rankings" style="width: 100%">
          <el-table-column type="index" label="排名" width="80" />
          <el-table-column prop="name" label="姓名" min-width="120" />
          <el-table-column prop="newCustomers" label="新增客户" width="100" />
          <el-table-column prop="revenue" label="贡献收益" width="120">
            <template #default="{ row }">
              ¥{{ row.revenue.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="level" label="等级" width="100">
            <template #default="{ row }">
              <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const chartPeriod = ref('month')

const stats = ref({
  newCustomers: 12,
  commissionIncome: 3580,
  renewalRate: 85.5,
  teamSize: 8
})

const rankings = ref([
  { name: '张三', newCustomers: 5, revenue: 1500, level: '金牌' },
  { name: '李四', newCustomers: 3, revenue: 900, level: '银牌' },
  { name: '王五', newCustomers: 2, revenue: 600, level: '铜牌' }
])

onMounted(() => {
  // TODO: 加载数据
})

function getLevelType(level: string) {
  const typeMap: any = {
    '金牌': '',
    '银牌': 'success',
    '铜牌': 'warning'
  }
  return typeMap[level] || 'info'
}
</script>

<style scoped lang="scss">
.performance-page {
  .el-statistic {
    text-align: center;
  }
}
</style>
