<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import TitleLogo from '@/components/TitleLogo.vue'
import Switch from '@/components/Switch.vue'
import SearchBar from '@/components/SearchBar.vue'
import { onBeforeMount, reactive } from 'vue'
import { type DeveloperRank } from '@/types/TalentRank'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { useFieldStore } from '@/stores/fieldStore'
import { api } from '@/api'
import { handleNetworkError } from '@/utils/request/RequestTools'

/* 实现父子组件通信(搜索模式切换) */
const searchStore = useSearchStore() // 使用pinia的数据
const userStore = useUserStore()
const fieldStore = useFieldStore()

const changeSearchMode = async () => {
  await searchStore.changeSearchMode()
  console.log('current mode value: ' + searchStore.getSearchMode())
}

let talentRankList = reactive<DeveloperRank[]>([])

onBeforeMount(async () => {
  // 获取TalentRank数据
  const [err, data] = await api.listRank(1, 50)
  if (err) handleNetworkError(err)
  if (!data || !data?.list) return
  talentRankList = data.list

  // 更新talentRankList
  userStore.setTalentRankList(talentRankList);
  const [err2, data2] = await api.listTag()
  if (err2) handleNetworkError(err2)
  if (!data2 || !data2?.list) return
  let tagList = data2.list
  
  // 领域列表存入store
  fieldStore.setFieldList(tagList)
  console.log('field list', fieldStore.getFieldList())
})
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
      
      <!-- 领域搜索区域 -->
      <SearchBar v-if="searchStore.getSearchMode()" class="search_bar" 
        :inputWidth="45" :inputWidthUnit="'%'" :inputHeight="60" :inputHeightUnit="'px'" 
        :image="0" :iconWidth="40" :iconHeight="40"/>
      <!-- 普通搜索区域 -->
      <SearchBar v-else class="search_bar" 
        :inputWidth="85" :inputWidthUnit="'%'" :inputHeight="60" :inputHeightUnit="'px'" 
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

    margin-bottom: 130px;

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
