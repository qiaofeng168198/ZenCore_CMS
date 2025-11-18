<template>
  <div class="documentation-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <h3>快速开始</h3>
          <p>了解如何快速创建和上传模板</p>
          <el-button type="primary" text @click="handleViewDoc('quick-start')">查看文档 →</el-button>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <h3>模板开发规范</h3>
          <p>掌握模板开发的最佳实践</p>
          <el-button type="primary" text @click="handleViewDoc('guidelines')">查看文档 →</el-button>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <h3>API 文档</h3>
          <p>查看完整的 API 接口文档</p>
          <el-button type="primary" text @click="handleViewDoc('api')">查看文档 →</el-button>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <h3>常见问题</h3>
          <p>快速解决开发中的常见问题</p>
          <el-button type="primary" text @click="handleViewDoc('faq')">查看文档 →</el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>开发指南</span>
      </template>

      <el-collapse>
        <el-collapse-item title="如何创建模板？" name="1">
          <div>
            <h4>步骤一：准备模板文件</h4>
            <p>创建包含 HTML、CSS、JavaScript 的完整模板文件夹。</p>
            <h4>步骤二：配置模板信息</h4>
            <p>创建 template.json 配置文件，填写模板名称、描述、版本等信息。</p>
            <h4>步骤三：打包上传</h4>
            <p>将模板打包为 zip 文件，在"我的模板"页面上传。</p>
          </div>
        </el-collapse-item>

        <el-collapse-item title="模板审核标准" name="2">
          <div>
            <ul>
              <li>代码质量：代码结构清晰，符合规范</li>
              <li>响应式设计：支持各种屏幕尺寸</li>
              <li>浏览器兼容：兼容主流浏览器</li>
              <li>性能优化：加载速度快，资源优化</li>
              <li>文档完整：提供详细的使用说明</li>
            </ul>
          </div>
        </el-collapse-item>

        <el-collapse-item title="收益分成规则" name="3">
          <div>
            <p>
              <strong>下载收费模板：</strong>开发者获得售价的 70%<br>
              <strong>订阅模板：</strong>开发者获得订阅费的 50%<br>
              <strong>结算周期：</strong>每月 1 号结算上月收益<br>
              <strong>提现方式：</strong>支持支付宝、微信、银行卡
            </p>
          </div>
        </el-collapse-item>

        <el-collapse-item title="技术支持" name="4">
          <div>
            <p>如有任何问题，请通过以下方式联系我们：</p>
            <ul>
              <li>邮箱：developer@zencore.com</li>
              <li>QQ群：123456789</li>
              <li>工作时间：周一至周五 9:00-18:00</li>
            </ul>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

function handleViewDoc(type: string) {
  ElMessage.info('查看文档：' + type)
}
</script>

<style scoped lang="scss">
.documentation-page {
  h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
  }

  p {
    margin: 0 0 15px 0;
    color: #606266;
    font-size: 14px;
  }

  h4 {
    margin: 15px 0 8px 0;
    font-size: 16px;
  }

  ul {
    margin: 10px 0;
    padding-left: 20px;

    li {
      margin: 5px 0;
      color: #606266;
    }
  }
}
</style>
