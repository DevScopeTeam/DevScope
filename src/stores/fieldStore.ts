import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type FieldItem } from '@/types/FieldItem'

export const useFieldStore = defineStore('fieldStore', () => {  
  const state = reactive({
  })

  // define object class
  class FieldItemClass {
    name = ''
    uuid = ''
  }
  let curFieldItem = reactive<FieldItem>(new FieldItemClass())
  let curFieldItemList = reactive<FieldItem[]>(new Array())

  // 获取选择的领域
  const getField = () => {
    return curFieldItem
  }

  // 设置选择的领域
  const setField = (field: FieldItem) => {
    curFieldItem = field
  }
  
  // 获取领域列表
  const getFieldList = () => {
    return curFieldItemList
  }
  
  // 设置领域列表
  const setFieldList = (list: FieldItem[]) => {
    curFieldItemList = list
  }

  // 判断选择的领域是否为空
  const checkIfEmpty = () => {
    return curFieldItem !== null && curFieldItem.uuid !== ''
  }

  return { state, getField, setField, getFieldList, setFieldList, checkIfEmpty }
})
