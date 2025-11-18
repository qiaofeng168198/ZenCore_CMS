<template>
  <div class="subscription-page">
    <!-- 当前订阅 -->
    <el-card class="current-subscription">
      <template #header>
        <span>当前订阅</span>
      </template>
      <div v-if="currentSubscription && currentSubscription.plan" class="subscription-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="套餐名称">{{ currentSubscription.plan.name }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentSubscription.status === 'active' ? 'success' : 'warning'">
              {{ currentSubscription.status === 'active' ? '正常' : currentSubscription.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="计费周期">
            {{ currentSubscription.billingCycle === 'monthly' ? '月付' : '年付' }}
          </el-descriptions-item>
          <el-descriptions-item label="到期时间">{{ currentSubscription.endDate }}</el-descriptions-item>
          <el-descriptions-item label="用户配额">
            {{ currentSubscription.currentUsers }} / {{ currentSubscription.plan.maxUsers }}
          </el-descriptions-item>
          <el-descriptions-item label="存储配额">
            {{ formatStorage(currentSubscription.currentStorage) }} / {{ formatStorage(currentSubscription.plan.maxStorage) }}
          </el-descriptions-item>
          <el-descriptions-item label="流量配额">
            {{ formatStorage(currentSubscription.currentBandwidth) }} / {{ formatStorage(currentSubscription.plan.maxBandwidth) }}
          </el-descriptions-item>
          <el-descriptions-item label="自动续费">
            <el-switch v-model="currentSubscription.autoRenew" @change="handleAutoRenew" />
          </el-descriptions-item>
        </el-descriptions>
        <div class="actions" style="margin-top: 20px;">
          <el-button type="primary" @click="showPlans">升级套餐</el-button>
          <el-button type="danger" @click="handleCancel">取消订阅</el-button>
        </div>
      </div>
      <el-empty v-else description="暂无订阅" />
    </el-card>

    <!-- 套餐列表 -->
    <el-card class="plans-card" style="margin-top: 20px;">
      <template #header>
        <span>可用套餐</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="plan in plans" :key="plan.id">
          <el-card shadow="hover" class="plan-card">
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">
              <span class="price">¥{{ plan.monthlyPrice }}</span>/月
            </div>
            <div class="plan-price">
              <span class="price">¥{{ plan.yearlyPrice }}</span>/年
            </div>
            <el-divider />
            <div class="plan-features">
              <div>用户数：{{ plan.maxUsers }}</div>
              <div>存储：{{ formatStorage(plan.maxStorage) }}</div>
              <div>流量：{{ formatStorage(plan.maxBandwidth) }}</div>
            </div>
            <el-button type="primary" style="width: 100%; margin-top: 15px;" @click="handleSubscribe(plan)">
              订阅
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSubscriptionStore } from '@/store/subscription'

const subscriptionStore = useSubscriptionStore()

const currentSubscription = ref<any>(null)
const plans = ref<any[]>([])

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  try {
    plans.value = await subscriptionStore.fetchPlans()
    currentSubscription.value = await subscriptionStore.fetchCurrentSubscription()
  } catch (error) {
    console.error('获取订阅信息失败:', error)
  }
}

function showPlans() {
  ElMessage.info('请选择下方套餐进行升级')
}

async function handleSubscribe(plan: any) {
  try {
    const { value } = await ElMessageBox.prompt('请选择计费周期', '订阅套餐', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'text',
      inputValue: 'monthly',
      inputValidator: (val: string) => ['monthly', 'yearly'].includes(val),
      inputErrorMessage: '请输入 monthly 或 yearly'
    })
    await subscriptionStore.subscribe(plan.id)
    ElMessage.success('订阅成功')
    await fetchData()
  } catch (error) {
    // 用户取消
  }
}

async function handleCancel() {
  try {
    await ElMessageBox.confirm('确定要取消订阅吗？', '警告', { type: 'warning' })
    await subscriptionStore.cancelSubscription()
    ElMessage.success('取消成功')
    await fetchData()
  } catch (error) {
    // 用户取消
  }
}

async function handleAutoRenew(value: boolean) {
  try {
    await subscriptionStore.fetchCurrentSubscription()
    ElMessage.success('设置成功')
  } catch (error) {
    ElMessage.error('设置失败')
  }
}

function formatStorage(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB'
}
</script>

<style scoped lang="scss">
.current-subscription {
  margin-bottom: 20px;
}

.plan-card {
  text-align: center;

  .plan-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .plan-price {
    margin: 10px 0;

    .price {
      font-size: 28px;
      color: #409eff;
      font-weight: bold;
    }
  }

  .plan-features {
    text-align: left;

    div {
      padding: 5px 0;
    }
  }
}
</style>
