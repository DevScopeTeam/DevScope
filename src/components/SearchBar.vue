<script setup lang="ts">
import { reactive } from 'vue'
import search from '@/assets/image/search.png'
import search_black from '@/assets/image/search_black.png'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { defineProps } from 'vue'
import { type TalentRank } from '@/types/TalentRank'
import { type FieldItem } from '@/types/FieldItem'
import { useSearchStore } from '@/stores/searchStore'
import { useUserStore } from '@/stores/userStore'
import { useFieldStore } from '@/stores/fieldStore'

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
const fieldStore = useFieldStore()

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

/* 暂存用户信息列表 */
const state = reactive({
  // arr: [] as string[]
  uuid: ''
})

const goSearch = () => {
  let talentRank = reactive<TalentRank>(new TalentRankClass())
  let talentRankList = reactive<TalentRank[]>(new Array())
  
  console.log('current search content: ' + searchStore.getSearchContent()) // username / nation
  console.log('current field content: ' + state.uuid)

  // 区分普通搜索\领域搜索
  if (searchStore.getSearchMode() === true) {
    // 领域搜索

    if(state.uuid === ''){
      ElNotification({
        title: 'Attention',
        message: 'Please enter the content to search!',
        type: 'warning',
        position: 'top-right',
        offset: 60
      })
    } else {
      // 1.根据选择的领域，调api获取该领域的所有用户的排名
      axios.get('https://api.devscope.search.ren/domain/list?tag_uuid=' + state.uuid + '&page=1&pageSize=100')
        .then(res => {
          console.log('field users res.data', res.data)
          if (res.data.code !== 200) {
            ElNotification({
              title: 'Attention',
              message: 'There is no such user!',
              type: 'warning',
              position: 'top-right',
              offset: 60
            })
          } else {
            if (res.data.list === null || res.data.list === undefined) {
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
                talentRank.nation = res.data.list[i].nation
                talentRankList.push(talentRank)
                
                // clear the talentRank
                talentRank = reactive<TalentRank>(new TalentRankClass())
              }
              
              // 2.若有选择nation，则从step2的返回结果中筛选指定nation的用户
              let tmpList = reactive<TalentRank[]>(new Array())
              if (searchStore.checkIfEmpty()) { // 输入nation搜索
                talentRankList.forEach((v) => {
                  if (v.nation === searchStore.getSearchContent()) {
                    tmpList.push(v) // 筛选是指定nation的用户
                  }
                })
              } else { // 未输入nation搜索
                tmpList = talentRankList
              }
              console.log('tmpList',tmpList)

              // 3.往userStore.ts更新获取的talentRankList信息
              userStore.setTalentRankList(tmpList)
              console.log('the talentRankList', userStore.getTalentRankList())

              if (tmpList.length > 0) {
                // 4.jump to the ListView
                router.push({
                  path: '/list'
                })
              } else {
                ElNotification({
                  title: 'Attention',
                  message: 'There is no such user!',
                  type: 'warning',
                  position: 'top-right',
                  offset: 60
                })
              }
            }
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  } else {
    // 普通搜索
    if (searchStore.checkIfEmpty() === true) {
      // 1.调用用户信息
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

            // 2.construct field 'Position'
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

                  // 3.jump to the ListView
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
}
</script>

<template>
  <div class="outer_box">
    <!-- 领域搜索 -->
    <div v-if="searchStore.getSearchMode()" class="input_box">
      <el-input class="input" 
        :style="{width:props.inputWidth+props.inputWidthUnit, height:props.inputHeight+props.inputHeightUnit}"
        placeholder="Enter a nation."
        v-model="searchStore.state.searchContent">
      </el-input>

      <el-select class="field"
        :style="{width:(100-15-props.inputWidth)+props.inputWidthUnit, height:props.inputHeight+props.inputHeightUnit}"  
        v-model="state.uuid"
        placeholder="Choose a field."
        clearable
        ref="category">
        <el-option v-for="(item, index) in fieldStore.getFieldList()" :key="index" :label="item.name" :value="item.uuid"/>
      </el-select>
    </div>

    <!-- 普通搜索 -->
    <div v-else class="input_box">
      <el-input class="input" 
        :style="{width:props.inputWidth+props.inputWidthUnit, height:props.inputHeight+props.inputHeightUnit}"
        placeholder="Enter an username."
        v-model="searchStore.state.searchContent">
      </el-input>
    </div>

    <!-- 共用的搜索图标 -->
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

  /* 按领域搜索的输入框 */
  .input_box{
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .input{
      padding-right: 10px;
    }

    /* 自定义el-select内部样式 */
    :deep(.el-select__wrapper) { /* 外框 */
      height: 60px;

      border-radius: 40px;
      padding-left: 30px;
      letter-spacing: 1px;
      font-size: 16px;
      font-weight: 400;
    }
  }

  /* 自定义el-input内部样式 */
  :deep(.el-input__wrapper) { /* 外框 */
    border-radius: 40px;
  }
  :deep(.el-input__inner) { /* 输入区域 */
    margin: 0 10px;
    font-size: 16px;
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