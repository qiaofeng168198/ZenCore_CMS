<template>
  <div class="templates-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>模板市场</span>
          <el-button type="primary" @click="handleRefresh">刷新</el-button>
        </div>
      </template>

      <el-row :gutter="20" v-loading="loading">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="template in templateList" :key="template.id">
          <el-card shadow="hover" class="template-card">
            <div class="template-cover">
              <img :src="template.coverImage || '/default-template.png'" alt="模板封面" />
            </div>
            <div class="template-info">
              <h3 class="template-name">{{ template.name }}</h3>
              <p class="template-desc">{{ template.description }}</p>
              <div class="template-meta">
                <el-tag size="small">{{ template.category || '未分类' }}</el-tag>
                <el-rate v-model="template.ratingScore" disabled show-score text-color="#ff9900" />
              </div>
              <div class="template-stats">
                <span><el-icon><Download /></el-icon> {{ template.downloadCount }}</span>
                <span class="price">
                  <template v-if="template.isFree">免费</template>
                  <template v-else>¥{{ template.price }}</template>
                </span>
              </div>
              <div class="template-actions">
                <el-button type="primary" size="small" @click="handlePreview(template)">预览</el-button>
                <el-button size="small" @click="handleDownload(template)">下载</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-empty v-if="!loading && templateList.length === 0" description="暂无模板" />
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" :title="currentTemplate?.name" width="80%" fullscreen>
      <iframe
        v-if="currentTemplate?.previewUrl"
        :src="currentTemplate.previewUrl"
        style="width: 100%; height: 100%; border: none"
      ></iframe>
      <el-empty v-else description="暂无预览" />
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDownload(currentTemplate)">下载此模板</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { getMarketTemplates, downloadTemplate, type Template } from '@/api/template'

const loading = ref(false)
const templateList = ref<Template[]>([])
const previewVisible = ref(false)
const currentTemplate = ref<Template | null>(null)

// 获取模板列表
const fetchTemplates = async () => {
  loading.value = true
  try {
    templateList.value = await getMarketTemplates()
  } catch (error) {
    console.error('获取模板列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 刷新
const handleRefresh = () => {
  fetchTemplates()
}

// 预览
const handlePreview = (template: Template) => {
  currentTemplate.value = template
  previewVisible.value = true
}

// 下载
const handleDownload = async (template: Template | null) => {
  if (!template) return

  try {
    await downloadTemplate(template.id)
    ElMessage.success('下载成功！模板已添加到您的账户')
    previewVisible.value = false
  } catch (error) {
    console.error('下载失败:', error)
  }
}

onMounted(() => {
  fetchTemplates()
})
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.template-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  .template-cover {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: #f5f7fa;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .template-info {
    padding: 15px 0;

    .template-name {
      margin: 0 0 10px;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .template-desc {
      margin: 0 0 15px;
      font-size: 14px;
      color: #909399;
      height: 40px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .template-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .template-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      font-size: 14px;
      color: #909399;

      span {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .price {
        font-size: 18px;
        font-weight: 600;
        color: #f56c6c;
      }
    }

    .template-actions {
      display: flex;
      gap: 10px;

      .el-button {
        flex: 1;
      }
    }
  }
}
</style>
