<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import TitleLogo from '@/components/TitleLogo.vue'
import Switch from '@/components/Switch.vue'
import SearchBar from '@/components/SearchBar.vue'
import { onBeforeMount, reactive } from 'vue'
import axios from 'axios'
import { type TalentRank } from '@/types/TalentRank'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/userStore'

/* 实现父子组件通信(搜索模式切换) */
const searchStore = useSearchStore() // 使用pinia的数据
const userStore = useUserStore()

const changeSearchMode = async () => {
  await searchStore.changeSearchMode()
  console.log('current mode value: ' + searchStore.state.mode)
}

// define object class
class TalentRankClass {
  id = 0
  login = ''
  nation = ''
  project = 0
  code = 0
  influence = 0
  overall = 0
}
let talentRank = reactive<TalentRank>(new TalentRankClass())
let talentRankList = reactive<TalentRank[]>(new Array())

onBeforeMount(() => {
  // 1.获取TalentRank数据
  axios.get('https://api.devscope.search.ren/rank/list?page=' + '1' + '&pageSize=' + '50')
    .then(res => {
      console.log('rank list data', res.data)
      if (res.data.code !== 200) {
        ElNotification({
          title: 'Attention',
          message: 'There is no user!',
          type: 'warning',
          position: 'top-right',
          offset: 60
        })
      } else {
        if (res.data.list.length <= 0) {
          ElNotification({
            title: 'Attention',
            message: 'There is no rank data!',
            type: 'warning',
            position: 'top-right',
            offset: 60
          })
        } else {
          // 构造TalentRank数据
          for (let i=0; i<res.data.list.length; i++) {
            talentRank.login = res.data.list[i].username
            talentRank.project = res.data.list[i].project.toFixed(2)
            talentRank.code = res.data.list[i].code.toFixed(2)
            talentRank.influence = res.data.list[i].influence.toFixed(2)
            talentRank.overall = res.data.list[i].overall.toFixed(2)
            talentRankList.push(talentRank)
                
            // clear the talentRank
            talentRank = reactive<TalentRank>(new TalentRankClass())
          }
              
          // 往userStore.ts更新获取的talentRankList信息
          userStore.setTalentRankList(talentRankList)
          console.log('the talentRankList', userStore.getTalentRankList())
        }
      }
    })
    .catch(err => {
      console.log('err', err)
    })
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