<script setup lang="ts">
import { reactive, defineProps, watch, ref, nextTick, onBeforeMount, onMounted } from 'vue'
import * as echarts from 'echarts'
import { type TalentRank } from '@/types/TalentRank'
import axios from 'axios'
import { useSearchStore } from '@/stores/searchStore'
import { useUserStore } from '@/stores/userStore'
import { ElNotification } from 'element-plus'

interface Props {
  data: string
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

watch(
  () => props.data,
  (newVal, oldVal) => {
  }
)

const state = reactive({
  chartData: [] as any[],
  isLoading: true, 
  reRendering: true
})

// 定义ref
const chart = ref(null)

onBeforeMount(() => {
  nextTick(()=>{
    // 获取TalentRank数据
    axios.get('https://api.devscope.search.ren/rank/score?username=' + props.data) // 当前的用户的username
      .then(res => {
        // console.log('rank res.data', res.data.score)
        if (res.data.code !== 200) {
          ElNotification({
            title: 'Attention',
            message: 'Please waiting...',
            type: 'info',
            position: 'top-right',
            offset: 60
          })
        } else {
          // 构造TalentRank数据
          talentRank.login = props.data
          talentRank.project = res.data.score.project.toFixed(2)
          talentRank.code = res.data.score.code.toFixed(2)
          talentRank.influence = res.data.score.influence.toFixed(2)
          talentRank.overall = res.data.score.overall.toFixed(2)

          // 往userStore.ts更新获取的talentRank信息
          userStore.setTalentRank(talentRank)

          setTimeout(()=>{
            SetChart()
          }, 50)
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  })
})

// onMounted(() => {
//   setTimeout(() => {
//     SetChart()
//   }, 50)
// })

const SetChart = () => {
  nextTick(() => {
    state.isLoading = true

    const myChart = echarts.init(document.getElementById('chart')) // 声明组件

    // construct data
    let arr = [talentRank.project, talentRank.code, talentRank.influence] // sample value: [82, 33, 36]
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
        data: [talentRank.login],
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
        // formatter: function (params: any) { // params是包含当前数据信息的对象
        //   console.log('params',params)
        //   return (
        //     '<div style="text-align: left; font-size: 14px;">' +
        //     '<div style="display: flex; flex-direction: row;">' + 
        //     'project: ' + '<span style="color: #000;font-weight:500;">' + params.data[0] + '</span>' + 
        //     // '<br/>' +
        //     '</div>' + 
        //     'code: ' + params.data[1] +
        //     '<br/>' +
        //     'influence: ' + params.data[2] +
        //     '</div>'
        //   )
        // },
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
          // name: props.data.login, // user name
          name: talentRank.login, // user name
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