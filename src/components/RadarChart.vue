<script setup lang="ts">
import { reactive, defineProps, ref, nextTick, onBeforeMount } from 'vue'
import * as echarts from 'echarts'
import { type DeveloperRank } from '@/types/TalentRank'
import { useUserStore } from '@/stores/userStore'
import { api } from '@/api'
import { handleNetworkError } from '@/utils/request/RequestTools'

interface Props {
  data: string
}
const props = defineProps<Props>()

const userStore = useUserStore()

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
let talentRank = reactive<DeveloperRank>(new TalentRankClass())

const state = reactive({
  chartData: [] as any[],
  isLoading: true, 
  reRendering: true
})

// 定义ref
const chart = ref(null)

onBeforeMount(async () => {
  nextTick(async () => {
    // 获取TalentRank数据
    const [err, data] = await api.getScore(props.data)
    if (err) handleNetworkError(err)
    if (!data || !data?.score) return
    talentRank = data.score
    
    //保留小数点后两位
    talentRank.project = Number(talentRank.project.toFixed(2))
    talentRank.code = Number(talentRank.code.toFixed(2))
    talentRank.influence = Number(talentRank.influence.toFixed(2))
    talentRank.overall = Number(talentRank.overall.toFixed(2))
    
    // 往userStore.ts更新获取的talentRank信息
    userStore.setTalentRank(talentRank)

    setTimeout(()=>{
      SetChart()
    }, 50)
  })
})

const SetChart = () => {
  nextTick(() => {
    state.isLoading = true

    const myChart = echarts.init(document.getElementById('chart')) // 声明组件

    // construct data
    const arr = [talentRank.project, talentRank.code, talentRank.influence] // sample value: [82, 33, 36]
    state.chartData.push(arr)
    
    // const myOption = {
    const myOption = {
      backgroundColor: '#0A1222',

      title: {
        text: 'Developer technical skills',
        left: 5,
        top: 5,
        textStyle: {
          color: '#36a1ff',
          fontSize: '18px',
          fontFamily: 'YeZiGongChangShanHaiMingChao-2'
        }
      },
      
      legend: {
        // data: [props.data.login],
        data: [talentRank.username],
        bottom: 10,
        itemGap: 10,
        textStyle: {
          color: '#fff',
          fontSize: 12
        },
        selectedMode: 'multiple' // 图例模式
      },

      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: "none"
        },
        textStyle: {
          color: '#333'
        },
        // 内发光
        extraCssText: 'box-shadow: 0px 0px 10px 0px rgba(1, 124, 255, 0.40) inset'
      },

      radar: {
        // 位置
        center: ['50%', '65%'],
        // 半径
        radius: '80%',
        // 指示器
        indicator: [
          { name: 'Project', max: 100 },
          { name: 'Code', max: 100 },
          { name: 'Influence', max: 100 }
        ],
        // 坐标轴在 grid 区域中的分隔区域，默认不显示
        splitArea: {
          show: false
        },
        // 坐标轴在 grid 区域中的分隔线
        splitLine: {
          lineStyle: {
            color: [
              'rgba(73, 125, 214, 0.1)',
              'rgba(73, 125, 214, 0.2)',
              'rgba(73, 125, 214, 0.4)',
              'rgba(73, 125, 214, 0.6)',
              'rgba(73, 125, 214, 0.8)',
              'rgba(73, 125, 214, 1)'
            ].reverse()
          }
        },
        // 每个指示器名称
        axisName: {
          color: '#ffffff',
          fontSize: 14
        },
        // 坐标轴轴线
        axisLine: {
          lineStyle: {
            color: 'rgba(73, 120, 220, 0.5)'
          }
        },
        // 指示器轴的分割段数
        splitNumber: 5
      },

      series: [
        {
          name: talentRank.username, // user name
          type: 'radar',
          lineStyle: {
            width: 1,
            opacity: 0.7
          },
          data: state.chartData,
          symbol: 'none',
          itemStyle: {
            color: '#3dff6a'
          },
          areaStyle: {
            opacity: 0.3
          }
        }
      ]
    }
    myChart.setOption(myOption, true)

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

    <div v-show="!state.isLoading" class="echart_box" id="chart" ref="chart"></div>
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