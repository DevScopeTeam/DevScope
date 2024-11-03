import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {  
  const state = reactive({
    // user: '', // 用户信息对象（按username搜索）
    userList: [] as string[] // 用户信息列表（按领域搜索）
  })
//   const user = reactive<UserObject>({})

//   // 获取单个用户信息
//   const getUserInfo = () => {
//     console.log('user: ' + state.user)
//     return state.user
//   }
  
//   // 设置单个用户信息
//   const setUserInfo = (user: []) => {
//     state.user = user
//   }

  // 获取用户信息
  const getUserList = () => {
    return state.userList
  }

  // 设置用户信息
  const setUserList = (userList: string[]) => {
    state.userList = userList
  }

  return { state, getUserList, setUserList }
})
