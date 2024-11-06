import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type DeveloperRank } from '@/types/TalentRank'

export const useUserStore = defineStore('userStore', () => {
  const state = reactive({
    user: '', // 用户信息对象（按username搜索）
    // userList: [] as string[] // 用户列表
  })
//   const user = reactive<UserObject>({})

  // 获取单个用户信息
  const getUserInfo = () => {
    return state.user
  }

  // 设置单个用户信息
  const setUserInfo = (user: string) => {
    state.user = user
  }

  // // 获取用户信息
  // const getUserList = () => {
  //   return state.userList
  // }

  // // 设置用户信息
  // const setUserList = (userList: string[]) => {
  //   state.userList = userList
  // }

  // define object class
  class TalentRankClass {
    id = 0
    login = ''
    username = ''
    nation = ''
    project = 0
    code = 0
    influence = 0
    overall = 0
  }
  let curTalentRank = reactive<DeveloperRank>(new TalentRankClass())
  let curTalentRankList = reactive<DeveloperRank[]>([])

  // 获取talentRank
  const getTalentRank = () => {
    return curTalentRank
  }

  // 设置talentRank
  const setTalentRank = (newTalentRank: DeveloperRank) => {
    curTalentRank = newTalentRank
  }

  // 获取talentRankList
  const getTalentRankList = () => {
    return curTalentRankList
  }

  // 设置talentRankList
  const setTalentRankList = (newTalentRankList: DeveloperRank[]) => {
    curTalentRankList = newTalentRankList
  }

  return { state, getTalentRank, setTalentRank, getTalentRankList, setTalentRankList, getUserInfo, setUserInfo }
})
