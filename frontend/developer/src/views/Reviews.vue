<template>
  <div class="reviews-page">
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span>用户评价</span>
          <el-radio-group v-model="filterRating">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="5">5星</el-radio-button>
            <el-radio-button label="4">4星</el-radio-button>
            <el-radio-button label="3">3星</el-radio-button>
            <el-radio-button label="2">2星以下</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div v-for="review in filteredReviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div>
            <el-avatar :size="40" :src="review.userAvatar" />
            <span class="username">{{ review.userName }}</span>
            <el-rate v-model="review.rating" disabled />
          </div>
          <span class="time">{{ review.createdAt }}</span>
        </div>
        <div class="review-content">
          <div class="template-name">模板：{{ review.templateName }}</div>
          <div class="comment">{{ review.comment }}</div>
          <div class="reply-btn" v-if="!review.reply">
            <el-button type="text" @click="handleReply(review)">回复</el-button>
          </div>
          <div class="reply" v-if="review.reply">
            <div class="reply-label">开发者回复：</div>
            <div>{{ review.reply }}</div>
          </div>
        </div>
      </div>

      <el-empty v-if="filteredReviews.length === 0" description="暂无评价" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { mockReviews } from '@/mock/data'

const filterRating = ref('all')

const reviewList = ref<any[]>([])

const filteredReviews = computed(() => {
  if (filterRating.value === 'all') {
    return reviewList.value
  }
  if (filterRating.value === '2') {
    return reviewList.value.filter(r => r.rating <= 2)
  }
  return reviewList.value.filter(r => r.rating === parseInt(filterRating.value))
})

onMounted(() => {
  fetchReviews()
})

async function fetchReviews() {
  try {
    // 使用Mock数据
    reviewList.value = [...mockReviews]
  } catch (error) {
    console.error('加载评价数据失败:', error)
  }
}

function handleReply(review: any) {
  ElMessage.info('回复评价：' + review.comment)
}
</script>

<style scoped lang="scss">
.review-item {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;

  &:last-child {
    border-bottom: none;
  }

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .username {
      margin: 0 15px;
      font-weight: 600;
    }

    .time {
      color: #909399;
      font-size: 12px;
    }
  }

  .review-content {
    margin-left: 55px;

    .template-name {
      color: #909399;
      font-size: 12px;
      margin-bottom: 8px;
    }

    .comment {
      line-height: 1.6;
      margin-bottom: 10px;
    }

    .reply {
      background: #f5f7fa;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;

      .reply-label {
        font-weight: 600;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
