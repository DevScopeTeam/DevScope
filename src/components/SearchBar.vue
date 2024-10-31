<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import search from '@/assets/image/search.png'

/* 实现父子组件通信 */
const userStore = useSearchStore() // 使用pinia的数据

const goSearch = async () => {
  // await userStore.changeSearchMode()
  console.log('current search content: ' + userStore.state.searchContent)

  // TODO... 跳转到ListView

}

</script>

<template>
  <div class="outer_box">
    <el-input class="input"
      placeholder="Enter what you want to know."
      v-model="userStore.state.searchContent">
    </el-input>

    <div class="button">
      <img class="icon" :src="search" alt="" @click="goSearch()"/>
    </div>
  </div>
</template>

<style scoped>
.outer_box{
  width: 100%;
  height: 100%;

  /* 居中 */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .input{
    width: 85%;
    height: 60px;

  }

  /* 自定义el-input内部样式 */
  :deep(.el-input__wrapper) { /* 外框 */
    border-radius: 40px;
  }

  :deep(.el-input__inner) { /* 输入区域 */
    margin: 0 20px;
    font-size: 18px;
    letter-spacing: 2px;
    font-weight: 500;
  }

  /* 搜索图标 */
  .button{
    width: 15%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .icon{
      width: 40px;
      height: 40px;
    }

    .icon:hover{
      cursor: pointer;
    }
  }
}
</style>