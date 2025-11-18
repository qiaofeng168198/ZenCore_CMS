<template>
  <div class="revenue-page">
    <!-- 收益统计卡片 -->
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="累计收益" :value="8560">
            <template #prefix>¥</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="本月收益" :value="1280">
            <template #prefix>¥</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="已提现" :value="7000">
            <template #prefix>¥</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="待结算" :value="1560">
            <template #prefix>¥</template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 收益记录 -->
    <el-card>
      <template #header>
        <span>收益明细</span>
      </template>
      <el-table :data="revenueList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="templateName" label="模板名称" min-width="150" />
        <el-table-column prop="type" label="收益类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ row.type === 'download' ? '下载' : '订阅' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="price" label="单价" width="100">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="收益金额" width="120">
          <template #default="{ row }">
            <span style="color: #67C23A">+¥{{ row.amount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'settled' ? 'success' : 'warning'">
              {{ row.status === 'settled' ? '已结算' : '待结算' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const revenueList = ref([
  {
    id: 1,
    templateName: '企业官网模板',
    type: 'download',
    quantity: 5,
    price: 99,
    amount: 495,
    status: 'settled',
    createdAt: '2024-11-10 14:20:00'
  }
])

onMounted(() => {
  // TODO: 加载收益数据
})
</script>

<style scoped lang="scss">
</style>
