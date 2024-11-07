<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { defineProps } from 'vue'
import { type DeveloperRank } from '@/types/TalentRank'
import { useSearchStore } from '@/stores/searchStore'
import { useUserStore } from '@/stores/userStore'
import { useFieldStore } from '@/stores/fieldStore'
import search from '@/assets/image/search.png'
import search_black from '@/assets/image/search_black.png'
import { api } from '@/api/index'
import { handleNetworkError } from '@/utils/request/RequestTools'

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

/* 暂存用户信息列表 */
const state = reactive({
  uuid: ''
})

// const goSearch = async () => {
async function goSearch() {
  // console.log('current search content: ' + searchStore.getSearchContent()) // username / nation
  // console.log('current field content: ' + state.uuid)

  // 区分普通搜索\领域搜索
  if (searchStore.getSearchMode() === true) {
    // 领域搜索

    if (state.uuid === '') {
      ElNotification({
        title: 'Attention',
        message: 'Please enter the content to search!',
        type: 'warning',
        position: 'top-right',
        offset: 60
      })
    } else {
      // 1.调用api，获取指定领域的所有用户排名
      const [err, data] = await api.listDomainRank(state.uuid, 1, 100)
      if (err) handleNetworkError(err)
      if (!data || !data?.list) return
      const rankList = data.list

      // 2.若有选择nation，则从step2的返回结果中筛选指定nation的用户
      let tmpList = reactive<DeveloperRank[]>([])
      if (searchStore.checkIfEmpty()) { // 输入nation搜索
        rankList.forEach((v) => {
          if (v.nation === searchStore.getSearchContent()) {
            tmpList.push(v) // 筛选是指定nation的用户
          }
        })
      } else { // 未输入nation搜索
        tmpList = rankList
      }

      // 3.往userStore.ts更新获取的talentRankList信息
      userStore.setTalentRankList(tmpList)
      console.log('TalentRank List', userStore.getTalentRankList())

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
  } else {
    // 普通搜索
    if (searchStore.checkIfEmpty()) {
      const [err, data] = await api.getInfo(searchStore.state.searchContent)
      if (err) handleNetworkError(err)
      if (!data || !data?.user) return
      const api_user = data.user;
      console.log('info', api_user);

      const [err2, nation_data] = await api.getNation(searchStore.state.searchContent)
      if (err2) handleNetworkError(err2)
      if (nation_data?.nation) {
        api_user.location = nation_data.nation;
      }
      if (api_user.location == "" || api_user.location == "Unknown") {
        api_user.location = "N/A"
      }

      // 将空的内容设置为N/A
      if (api_user.name == "") api_user.name = "N/A"
      if (api_user.company == "") api_user.company = "N/A"
      if (api_user.url == "") api_user.company = "N/A"
      if (api_user.blog == "") api_user.blog = "N/A"
      if (api_user.email == "") api_user.email = "N/A"
      if (api_user.bio == "") api_user.bio = "N/A"

      // 往userStore.ts更新获取的user信息
      userStore.setUserInfo(JSON.stringify(api_user))
      console.log(userStore.getUserInfo())

      // 3.jump to the ListView
      router.push({
        path: '/list'
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
        :style="{ width: props.inputWidth + props.inputWidthUnit, height: props.inputHeight + props.inputHeightUnit }"
        placeholder="Enter a nation." v-model="searchStore.state.searchContent">
      </el-input>

      <el-select class="field"
        :style="{ width: (100 - 15 - props.inputWidth) + props.inputWidthUnit, height: props.inputHeight + props.inputHeightUnit }"
        v-model="state.uuid" placeholder="Choose a field." clearable ref="category">
        <el-option v-for="(item, index) in fieldStore.getFieldList()" :key="index" :label="item.name"
          :value="item.uuid" />
      </el-select>
    </div>

    <!-- 普通搜索 -->
    <div v-else class="input_box">
      <el-input class="input"
        :style="{ width: props.inputWidth + props.inputWidthUnit, height: props.inputHeight + props.inputHeightUnit }"
        placeholder="Enter an username." v-model="searchStore.state.searchContent">
      </el-input>
    </div>

    <!-- 共用的搜索图标 -->
    <div class="button">
      <img class="icon" :style="{ width: props.iconWidth + 'px', height: props.iconHeight + 'px' }"
        :src="props.image === 0 ? search : search_black" alt="" @click="goSearch()" />
    </div>
  </div>
</template>

<style scoped>
.outer_box {
  width: 100%;
  height: 100%;

  /* 居中 */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  /* 按领域搜索的输入框 */
  .input_box {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .input {
      padding-right: 10px;
    }

    /* 自定义el-select内部样式 */
    :deep(.el-select__wrapper) {
      /* 外框 */
      height: 60px;

      border-radius: 40px;
      padding-left: 30px;
      letter-spacing: 1px;
      font-size: 16px;
      font-weight: 400;
    }
  }

  /* 自定义el-input内部样式 */
  :deep(.el-input__wrapper) {
    /* 外框 */
    border-radius: 40px;
  }

  :deep(.el-input__inner) {
    /* 输入区域 */
    margin: 0 10px;
    font-size: 16px;
    letter-spacing: 2px;
    font-weight: 400;
  }

  /* 搜索图标 */
  .button {
    width: 15%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .icon {
      margin-left: 5px;
    }

    .icon:hover {
      cursor: pointer;
    }
  }
}
</style>
