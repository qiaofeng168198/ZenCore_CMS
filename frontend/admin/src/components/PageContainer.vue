<template>
  <el-card class="page-container">
    <template #header v-if="title || $slots.header">
      <div class="page-header">
        <slot name="header">
          <h3>{{ title }}</h3>
        </slot>
      </div>
    </template>
    <slot />
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped lang="scss">
.page-container {
  margin-bottom: 20px;
}

.page-header {
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
