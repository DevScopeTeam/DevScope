<script setup lang="ts">
import { reactive } from 'vue'
import { useSearchStore } from '@/stores/searchStore'
import { useUserStore } from '@/stores/userStore'
import search from '@/assets/image/search.png'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElNotification } from 'element-plus'

const router = useRouter() // 使用路由

/* 使用pinia的数据，实现父子组件通信 */
const searchStore = useSearchStore()
const userStore = useUserStore()

/* 暂存用户信息列表 */
const state = reactive({
  arr: [] as string[]
})

const goSearch = async () => {
  // await userStore.changeSearchMode()
  console.log('current search content: ' + searchStore.state.searchContent)

  if (searchStore.checkIfEmpty() === true) {
    // 区分是普通搜索还是领域搜索
    if (searchStore.getSearchMode() === true) {
      // TODO ...领域搜索,call api using axios


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
      // call api using axios
      axios.get('https://api.devscope.search.ren/github/user/info?username=' + searchStore.state.searchContent)
        .then(res => {
          console.log('res.data', res.data)
          
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
            for (let item in api_user) {
              if (api_user[item] === null || api_user[item] === '' || api_user[item] === undefined) { // 空数据填充N/A
                api_user[item] = 'N/A'
              }
            }
            
            state.arr.push(JSON.stringify(api_user))
            console.log('userinfo', state.arr)
            
            // 往userStore.ts更新获取的user信息
            userStore.setUserList(state.arr)

            // 跳转到ListView
            router.push({
              path: '/list'
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
      placeholder="Enter what you want to know."
      v-model="searchStore.state.searchContent">
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