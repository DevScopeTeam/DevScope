import { reactive } from 'vue'
import { defineStore } from 'pinia'

export const useSearchStore = defineStore('searchStore', () => {
  const state = reactive({
    mode: false, // 是否按领域搜索
    searchContent: '' // 搜索的内容
  })
  
  // 切换搜索模式
  function changeSearchMode() {
    state.mode = !state.mode
  }

  // 获取搜索的内容
  function getSearchContent() {
    return state.searchContent
  }

  // 更新搜索的内容
  function setSearchContent(content: string) {
    state.searchContent = content
  }

  return { state, changeSearchMode, getSearchContent, setSearchContent }
})
