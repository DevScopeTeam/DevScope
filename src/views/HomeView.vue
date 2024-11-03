<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import TitleLogo from '@/components/TitleLogo.vue'
import Switch from '@/components/Switch.vue'
import SearchBar from '@/components/SearchBar.vue'

/* 实现父子组件通信(搜索模式切换) */
const userStore = useSearchStore() // 使用pinia的数据

const changeSearchMode = async () => {
  await userStore.changeSearchMode()
  console.log('current mode value: ' + userStore.state.mode)
}
</script>

<template>
  <div class="outer_box">
    <!-- title -->
    <TitleLogo class="title" :color="'rgb(247, 250, 252)'" :fontSize="60" :fontFamily="'TsangerYuYangT_W05_W05'" 
      :fontStyle="'italic'" :letterSpacing="3"/>

    <!-- 搜索框 -->
    <div class="search_box">
      <!-- 切换搜索模式 -->
      <Switch class="switch" @click="changeSearchMode"/>
      <!-- 搜索区域 -->
      <SearchBar class="search_bar" :inputWidth="85" :inputWidthUnit="'%'" :inputHeight="60" :inputHeightUnit="'px'" 
        :image="0" :iconWidth="40" :iconHeight="40"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outer_box{
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title{
    width: 60%;
    height: 100px;
  }
  
  .search_box{
    width: 60%;
    height: 70px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .switch{
      width: 80px;
      height: 100%;
    }

    .search_bar{
      width: calc(100% - 80px);
      height: 100%;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>