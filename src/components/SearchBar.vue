<script setup lang="ts">
import { reactive } from 'vue'
import { useSearchStore } from '@/stores/searchStore'
import { useUserStore } from '@/stores/userStore'
import search from '@/assets/image/search.png'
import search_black from '@/assets/image/search_black.png'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { defineProps } from 'vue'
import { type TalentRank } from '@/types/TalentRank'

interface Props {
  inputWidth: number
  inputWidthUnit: string
  inputHeight: number
  inputHeightUnit: string
  image: number // 0: white, 1: black
  iconWidth: number
  iconHeight: number
}
const props = defineProps<Props>()

const router = useRouter() // 使用路由

/* 使用pinia的数据，实现父子组件通信 */
const searchStore = useSearchStore()
const userStore = useUserStore()

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

/* 暂存用户信息列表 */
const state = reactive({
  // arr: [] as string[]
})

const goSearch = () => {
  // await userStore.changeSearchMode()
  console.log('current search content: ' + searchStore.state.searchContent)

  if (searchStore.checkIfEmpty() === true) {
    // 区分普通搜索\领域搜索
    if (searchStore.getSearchMode() === true) {
      // TODO ...领域搜索


      // axios.get('')
      //   .then(res => {
      //     // console.log('userinfo', JSON.stringify(res.data.user))

      //     // // 往userStore.ts更新获取的user信息
      //     // userStore.setUserInfo(JSON.stringify(res.data.user))

      //     // // 跳转到ListView
      //     // router.push({
      //     //   path: '/list'
      //     // })
      //   })
      //   .catch(err => {
      //     console.log('err', err)
      //   })
    } else {
      // 普通搜索(开始调用排名列表，然后调用userinfo，再建立关联)
      axios.get('https://api.devscope.search.ren/github/user/info?username=' + searchStore.state.searchContent)
        .then(res => {
          // console.log('user res.data', res.data)
          if (res.data.code !== 200) {
            ElNotification({
              title: 'Attention',
              message: 'There is no such user!',
              type: 'warning',
              position: 'top-right',
              offset: 60
            })
          } else {
            let api_user = res.data.user
            // 空数据填充N/A
            for (let item in api_user) {
              if (api_user[item] === null || api_user[item] === '' || api_user[item] === undefined) {
                api_user[item] = 'N/A'
              }
            }

            // construct field 'Position'
            axios.get('https://api.devscope.search.ren/github/user/nation?username=' + searchStore.state.searchContent)
            .then(res2 => {
              // console.log('positon res.data', res2.data)
              if (res2.data.code !== 200) {
                ElNotification({
                  title: 'Attention',
                  message: 'There is no such user!',
                  type: 'warning',
                  position: 'top-right',
                  offset: 60
                })
              } else {
                // get the nation
                api_user['position'] = res2.data.nation

                // 往userStore.ts更新获取的user信息
                userStore.setUserInfo(JSON.stringify(api_user))

                // jump to the ListView
                router.push({
                  path: '/list'
                })
              }
            })
            .catch(err => {
              console.log('err', err)
            })
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  } else {
    ElNotification({
      title: 'Attention',
      message: 'Please enter the content to search!',
      type: 'warning',
      position: 'top-right',
      offset: 60
    })
  }
}
</script>

<template>
  <div class="outer_box">
    <el-input class="input" 
      :style="{width:props.inputWidth+props.inputWidthUnit, height:props.inputHeight+props.inputHeightUnit}"
      placeholder="Enter what you want to know."
      v-model="searchStore.state.searchContent">
    </el-input>

    <div class="button">
      <img class="icon" :style="{width:props.iconWidth+'px', height:props.iconHeight+'px'}" 
        :src="props.image===0 ? search : search_black" alt="" @click="goSearch()"/>
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

  /* 自定义el-input内部样式 */
  :deep(.el-input__wrapper) { /* 外框 */
    border-radius: 40px;
  }
  :deep(.el-input__inner) { /* 输入区域 */
    margin: 0 20px;
    font-size: 18px;
    letter-spacing: 2px;
    font-weight: 400;
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
      margin-left: 5px;
    }

    .icon:hover{
      cursor: pointer;
    }
  }
}
</style>