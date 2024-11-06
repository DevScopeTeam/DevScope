import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', () => {
  const state = reactive({
    mode: false, // 是否按领域搜索
    searchContent: '' // 搜索的内容(username / nation)
  })

  // 获取搜索的内容
  const getSearchMode = () => {
    return state.mode
  }
  
  // 切换搜索模式
  const changeSearchMode = () => {
    state.mode = !state.mode
  }


  // 获取搜索的内容
  const getSearchContent = () => {
    return state.searchContent
  }

  // 更新搜索的内容
  const setSearchContent = (content: string) => {
    state.searchContent = content
  }

  // 判断searchContent是否为空
  const checkIfEmpty = () => {
    return state.searchContent !== null && state.searchContent !== ''
  }

  return { state, getSearchMode, changeSearchMode, getSearchContent, setSearchContent, checkIfEmpty }
})
