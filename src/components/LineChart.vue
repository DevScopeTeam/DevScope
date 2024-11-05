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
const line_chart = ref(null)

onBeforeMount(() => {
  nextTick(()=>{
    // 获取TalentRank数据
    axios.get('https://api.devscope.search.ren/rank/list?page=' + '1' + '&pageSize=' + '10')
      .then(res => {
        // console.log('rank list data', res.data)
        if (res.data.code !== 200) {
          ElNotification({
            title: 'Attention',
            message: 'There is no user!',
            type: 'warning',
            position: 'top-right',
            offset: 60
          })
        } else {
          if (res.data.list.length <= 0) {
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
              talentRankList.push(talentRank)
              
              // clear the talentRank
              talentRank = reactive<TalentRank>(new TalentRankClass())
            }
            
            // 往userStore.ts更新获取的talentRankList信息
            userStore.setTalentRankList(talentRankList)
            // console.log('talentRankList', userStore.getTalentRankList())

            setTimeout(()=>{
              SetChart()
            }, 50)
          }
        }
      })
      .catch(err => {
        console.log('err', err)
      })
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
    const myChart = echarts.init(document.getElementById('line_chart')) // 声明组件

    // construct Line data
    // 1.construct obj
    const seriesData = [] as any[]
    const lineObj = {
      name: 'Overall',
      type: 'line',
      symbol: 'circle', // inflection point style
      symbolSize: 5, // inflection point size
      emphasis: { // the highlight style when the mouse hovers over the column
        focus: 'series'
      },
      // inflection point color
      itemStyle: {
        color: 'rgba(64, 130, 230, 1)'
      },
      label: {
        show: true,
        fontSize: 10
      },
      // area chart
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(115, 187, 255)'
          },
          {
            offset: 1,
            color: 'rgb(77, 71, 255)'
          }
        ])
      },
      data: [],
      // barWidth: '30%',
    }
    seriesData.push(lineObj)
    
    // 2.construct usernames
    let userName = [] as string[]
    userStore.getTalentRankList().forEach((v) => {
      userName.push(v.login)
    })
    // console.log('userName',userName)

    // 3.put data
    userStore.getTalentRankList().forEach((v1) => {
      seriesData.forEach((v2) => {
        v2.data.push(v1.overall)
      })
    })
    // console.log('seriesData',seriesData)

    const myOption = {
      backgroundColor: '#0A1222',

      title: {
        text: 'Overall Talent Rank',
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
        right: '3%',
        bottom: '13%',
        containLabel: true // show label
      },

      xAxis: {
        type: 'category',
        data: userName,
        axisLabel: {
          interval: 0,
          rotate: 25
        }
      },

      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: ['rgba(73, 125, 214, 0.4)']
          }
        }
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

    <div v-show="!state.isLoading" class="echart_box" id="line_chart" ref="line_chart"></div>
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