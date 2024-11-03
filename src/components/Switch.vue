<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import { computed } from 'vue'

/* 实现父子组件通信(搜索模式切换) */
const userStore = useSearchStore() // 使用pinia的数据
const mode = computed(() => userStore.state.mode)

</script>

<template>
  <el-switch class="switch"
    v-model="mode"
    inline-prompt
    active-text="Field"
    active-color="#c4e2f4"
    inactive-color="#ff4949">
  </el-switch>
</template>

<style scoped>
.switch{
  width: 100%;
  height: 100%;
}

/* 自定义switch样式 */
:deep(.el-switch__core) {
  width: 60px;
  height: 27px;
  border-radius: 15px;
  background-color: #efefef;
}

/* switch的圆圈 */
:deep(.el-switch__core .el-switch__action) {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  background-color: #ffffff;
}

</style>