<script setup lang="ts">
import { reactive, defineProps, watch, ref, nextTick, onBeforeMount, onMounted } from 'vue'
import * as echarts from 'echarts'
import { type TalentRank } from '@/types/TalentRank'
import axios from 'axios'
import { useSearchStore } from '@/stores/searchStore'
import { useUserStore } from '@/stores/userStore'
import { ElNotification } from 'element-plus'

interface Props {
  // data: TalentRank
  // data: string
}
const props = defineProps<Props>()

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

// watch(
//   () => props.data,
//   (newVal, oldVal) => {
//       SetChart()
//   }
// )

const state = reactive({
  chartData: [] as any[],
  isLoading: true
})

// 定义ref
const bar_chart = ref(null)

onBeforeMount(() => {
  nextTick(()=>{
    // 获取TalentRank数据
    setTimeout(()=>{
      SetChart()
    }, 50)
  })
})

onMounted(() => {
  // setTimeout(() => {
    // SetChart()
  // }, 20000)
})

const SetChart = () => {
  nextTick(() => {
    state.isLoading = true
    const myChart = echarts.init(document.getElementById('bar_chart')) // 声明组件

    // construct Bar data
    // 1.construct xAxis labels
    const categories = ['Project', 'Code', 'Influence']

    // 2.construct series data
    const seriesData = [] as any[]
    for (let i = 0; i < (userStore.getTalentRankList()).length; i++) {
      // 最多显示10个用户的数据
      if (i === 10) {
        break;
      } else {
        const obj = {
          name: (userStore.getTalentRankList())[i].login,
          type: 'bar',
          stack: 'As', // stack
          emphasis: { // the highlight style when the mouse hovers over the column
            focus: 'series'
          },
          label: {
            show: true,
            fontSize: 10
          },
          data: []
        }
        seriesData.push(obj)
      }
    }

    // 3.stack datas
    userStore.getTalentRankList().forEach((v1) => {
      seriesData.forEach((v2) => {
        if (v2.name === v1.login) {
          v2.data[0] = v1.project
          v2.data[1] = v1.code
          v2.data[2] = v1.influence
        }
      })
    })
    // console.log('seriesData',seriesData)

    const myOption = {
      backgroundColor: '#0A1222',

      title: {
        text: 'Talent Rank',
        left: 5,
        top: 5,
        textStyle: {
          color: '#36a1ff',
          fontSize: '18px',
          fontFamily: 'YeZiGongChangShanHaiMingChao-2'
        }
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow' // default type; can also be 'line' or 'shadow'
        }
      },

      legend: {
        // data: [talentRank.login],
        bottom: 10,
        itemGap: 10,
        textStyle: {
          color: '#fff',
          fontSize: 10
        },
        selectedMode: 'multiple' // 图例模式
      },

      grid: {
        left: '3%',
        right: '7%',
        bottom: '24%',
        containLabel: true // show label
      },

      xAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: ['rgba(73, 125, 214, 0.4)']
          }
        }
      },

      yAxis: {
        type: 'category',
        data: categories
      },

      series: seriesData
    }
    myChart.setOption(myOption)

    state.isLoading = false
  })
}
</script>

<template>
  <div class="outer_box">
    <!-- skeleton -->
    <el-skeleton v-show="state.isLoading" class="skeleton_box" animated>
      <template #template>
        <el-skeleton-item variant="image" class="image"/>
      </template>
    </el-skeleton>

    <div v-show="!state.isLoading" class="echart_box" id="bar_chart" ref="bar_chart"></div>
  </div>
</template>

<style scoped>
.outer_box{
  width: 100%;
  height: 100%;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .skeleton_box{
    width: 500px;
    height: 270px;

    .image{
      width: 100%; 
      height: 100%;
    }
  }

  .echart_box{
    width: 500px;
    height: 270px;
  }
}
</style>