<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { reactive, ref, nextTick, onBeforeMount, onMounted } from 'vue'
import * as echarts from 'echarts'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const state = reactive({
  chartData: [] as any[],
  isLoading: true
})

// 定义ref
const line_chart = ref(null)

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
    }
    seriesData.push(lineObj)
    
    // 2.construct usernames
    const userName = [] as string[]
    userStore.getTalentRankList().forEach((v) => {
      userName.push(v.username)
    })

    // 3.put data
    userStore.getTalentRankList().forEach((v1) => {
      seriesData.forEach((v2) => {
        v2.data.push(Number(v1.overall.toFixed(2)))
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
          interval: 'auto',
          rotate: 20
        },
        axisTick: {
          interval: 'auto'
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