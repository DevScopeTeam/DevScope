<script setup lang="ts">
import { onBeforeMount, reactive, watch, nextTick } from 'vue'
import { useSearchStore } from '@/stores/searchStore'
import { useUserStore } from '@/stores/userStore'
import position from '@/assets/image/position.png'
import company from '@/assets/image/company.png'
import url from '@/assets/image/url.png'
import blog from '@/assets/image/blog.png'
import email from '@/assets/image/email.png'
import top1 from '@/assets/image/top1.png'
import top2 from '@/assets/image/top2.png'
import top3 from '@/assets/image/top3.png'
import RadarChart from '@/components/RadarChart.vue'
import BarChart from '@/components/BarChart.vue'
import LineChart from '@/components/LineChart.vue'
import { type UserItem } from '@/types/UserItem'
import { type DeveloperRank } from '@/types/TalentRank'
import { api } from '@/api/index'
import { handleNetworkError } from '@/utils/request/RequestTools'
import type { UserInfo } from '@/types/info'
import { ElSkeleton, ElSkeletonItem } from 'element-plus'

/* 使用pinia的数据，实现父子组件通信 */
const userStore = useUserStore()
const searchStore = useSearchStore()

const state = reactive({
  top3List: [] as string[], // 存放top3的排名图标
  arr: [] as string[], // 暂存用户信息
  reRendering: true // true则显示右边的具体信息
})

// define object class
class userInfoClass {
	id = 0
  nodeid = ""
  avatar_url = ''
  name = ''
  login = ''
  position = ''
  location = ''
  company = ''
  url = ''
  blog = ''
  email = ''
  bio = ''
}
// define userinfo object
let curUser = reactive<UserInfo>(new userInfoClass())

// allocate member of UserItem
const allocateMember = (input: UserItem) => {
  let user = reactive<UserItem>(new userInfoClass())
  user.id = input.id
  user.avatar_url = input.avatar_url
  user.bio = input.bio
  user.blog = input.blog
  user.company = input.company
  user.email = input.email
  user.location = input.location
  user.login = input.login
  user.position = input.position
  user.url = input.url
  user.name = input.name
  return user
}

async function refreshUserInfo(username: string) {
  const [err, data] = await api.getInfo(username)
  if (err) handleNetworkError(err)
  if (!data || !data?.user) return
  const api_user = data.user;
  console.log('info', api_user);

  const [err2, nation_data] = await api.getNation(username)
  if (err2) handleNetworkError(err2)
  if (api_user.location == "" || api_user.location == "Unknown") {
    api_user.location = "N/A"
  }

  // 将空的内容设置为N/A
  if (api_user.name == "") api_user.name = "N/A"
  if (api_user.company == "") api_user.company = "N/A"
  if (api_user.url == "") api_user.company = "N/A"
  if (api_user.blog == "") api_user.blog = "N/A"
  if (api_user.email == "") api_user.email = "N/A"
  if (api_user.bio == "") api_user.bio = "N/A"

  // 往userStore.ts更新获取的user信息
  userStore.setUserInfo(JSON.stringify(api_user))
  curUser = api_user
  console.log('curUser', curUser)

  state.reRendering = false
  nextTick(() => {
    state.reRendering = true
  })

  return [err2, api_user]
}

const selectUser = async (user: DeveloperRank) => {
  console.log('user', user)

  refreshUserInfo(user.username)
}

onBeforeMount(async () => {
  if (searchStore.getSearchMode()) { // 领域模式
    // 根据领域的talentRankList的第一个元素的username，搜索该用户的基本信息
    selectUser((userStore.getTalentRankList())[0])
  } else { // 普通模式
    const user = allocateMember(JSON.parse(userStore.getUserInfo()))
    refreshUserInfo(user.login)
  }
  
  // 构造top3
  state.top3List.push(top1, top2, top3)
})

watch(
  () => curUser.login,
  (newVal, oldVal) => {
    console.log('newVal', newVal)
    console.log('oldVal', oldVal)
    state.reRendering = false
    nextTick(() => {
      state.reRendering = true
    })
  }
)

</script>

<template>
  <div class="outer_box">
    <!-- 列表 -->
    <div class="list_box">
      <div class="list_title">
        TalentRank
      </div>
      <div class="list_content" v-for="(item, index) in userStore.getTalentRankList()" 
        :key="index" :label="item" :value="item" @click="selectUser(item)">
        <!--排名图标（top 3）-->
        <img class="image" v-if="index < 3" :src="state.top3List[index]" alt=""/>
        <!--排名数字（others）-->
        <div class="number" v-else>{{ index + 1 }}</div>
        <div class="username">{{ item.username }}</div>
        <div class="score">{{ item.overall.toFixed(2) }}</div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="body_box">
      <div>
        <!-- info -->
        <div class="info_box" v-if="state.reRendering">
          <div class="base_info">
            <div class="amatar_box">
              <img class="avatar" :src="curUser.avatar_url" alt=""/>
            </div>
            <div class="name_box">
              <div class="name">{{ curUser.name }}</div>
              <div class="login">{{ curUser.login }}</div>
            </div>
          </div>

          <div class="company_info">
            <div class="group_box">
              <img class="icon" :src="position" alt=""/>
              <el-tooltip :content="curUser.location" placement="bottom" effect="light">
                <div class="position">{{ curUser.location }}</div>
              </el-tooltip>
              <!-- <el-tooltip :content="curUser.location" placement="bottom" effect="light">
                <div class="location">{{ curUser.location }}</div>
              </el-tooltip> -->
            </div>
            <div class="group_box">
              <img class="icon" :src="company" alt=""/>
              <el-tooltip :content="curUser.company" placement="bottom" effect="light">
                <div class="company">{{ curUser.company }}</div>
              </el-tooltip>
            </div>
          </div>

          <div class="link_info">
            <div class="group_box">
              <img class="icon" :src="url" alt=""/>
              <el-tooltip :content="curUser.url" placement="bottom" effect="light">
                <div class="url">{{ curUser.url }}</div>
              </el-tooltip>
            </div>
            <div class="group_box">
              <img class="icon" :src="blog" alt=""/>
              <el-tooltip :content="curUser.blog" placement="bottom" effect="light">
                <div class="blog">{{ curUser.blog }}</div>
              </el-tooltip>
            </div>
          </div>

          <div class="email_info">
            <div class="group_box">
              <img class="icon" :src="email" alt=""/>
              <el-tooltip :content="curUser.email" placement="bottom" effect="light">
                <div class="email">{{ curUser.email }}</div>
              </el-tooltip>
            </div>
          </div>

          <div class="bio_info">
            <el-input class="bio" type="textarea" :rows="3" v-model="curUser.bio"></el-input>
          </div>
        </div>

        <!-- talentRank -->
        <div class="rank_box">
          <div class="base_box">
            <div class="rank_title">Talent Rank</div>
            <RadarChart class="radar_chart" :data="curUser.login" v-if="state.reRendering"/>
            <BarChart class="bar_chart" />
            <LineChart class="line_chart" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.outer_box{
  width: 100%;
  height: 100%;

  padding: 54px 20px 25px 20px;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  .list_box{
    width: 20%;
    height: 95%;

    padding: 10px;
    border-radius: 10px;
    box-shadow: 3px 3px 8px #dcdcdc;
    background-color: rgb(247, 250, 252);

    display: flex;
    flex-direction: column;
    align-items: center;

    margin-right: 10px;
    
    // overflow scrolling
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0; // hidden scrollbar
    }

    .list_title{
      width: 100%;
      height: 50px;
      
      background-color: #000000;
      border-radius: 6px 6px 0 0;
      box-shadow: 1px 2px #dcdcdc;

      font-family: Oraqle-Script-2;
      letter-spacing: 3px;
      font-size: 34px;
      color: #ffffff;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      // // fixed at the top
      // position: -webkit-sticky;
      // position: sticky;
      // top: 0;
      // z-index: 9999;
    }

    .list_content:nth-child(1){
      border-radius: 0 0 6px 6px;
      margin-top: 50px;
    }
    .list_content:not(:first-child){
      border-radius: 6px;
    }
    .list_content{
      width: 100%;
      height: 45px;

      box-shadow: 1px 2px #dcdcdc;
      background-color: rgb(255, 255, 255);
      cursor: pointer;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      margin-bottom: 3px;

      .number{
        width: 15%;
        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        font-family: baranshoushu;
        font-size: 22px;
        color: #000000;
      }

      .username{
        width: 55%;
        height: 100%;

        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: left;

        font-family: YeZiGongChangShanHaiMingChao-2;
        font-size: 16px;
        font-weight: 300;
      }

      .image{
        width: 15%;
        height: 100%;

        padding: 5px;
        margin-right: 5px;
        text-align: center;
      }

      .score{
        width: 15%;
        height: 100%;

        padding: 5px;
        margin-top: 10px;
        
        color: rgb(59, 59, 79);
        font-family: TsangerYuYangT_W05_W05;
      }
    }
  }

  .body_box{
    width: 60%;
    height: 95%;

    padding: 20px;
    margin-left: 10px;
    background-color: rgb(247, 250, 252);
    border-radius: 10px;
    box-shadow: 2px 2px 6px #dcdcdc;

    display: flex;
    flex-direction: column;
    align-items: center;

    // overflow scrolling
    overflow-x: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0; // hidden scrollbar
    }

    .info_box{
      width: 100%;
      height: auto;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      .base_info{
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;

        padding: 10px;

        .amatar_box{
          width: 30%;
          height: 100%;

          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          
          .avatar{
            width: 80%;
            height: 80%;

            border-radius: 50%;
            box-shadow: 2px 2px 6px #dcdcdc;
          }
        }

        .name_box{
          width: 70%;
          height: 100%;

          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .name{
            width: 100%;
            height: auto;

            text-align: left;
            padding-left: 20px;
            font-size: 40px;
            letter-spacing: 1px;
            font-family: TsangerYuYangT_W05_W05;

            // 溢出隐藏
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .login{
            width: 100%;
            height: auto;

            text-align: left;
            padding-left: 20px;
            font-size: 20px;
            letter-spacing: 1px;
            font-family: TsangerYuYangT_W02_W02;

            // 溢出隐藏
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      // 居中与非居中的划分
      .company_info, .link_info{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
      }
      .email_info{
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        // margin-left: 4%;
      }

      .company_info, .link_info, .email_info{
        width: 100%;
        height: 100%;

        padding: 10px;

        .group_box{
          // width: 48%;
          width: 415px;
          height: 100%;

          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          
          box-shadow: 2px 2px 6px #dcdcdc;
          border-radius: 10px;
          margin: 5px;
          padding: 5px;
          background-color: rgb(255, 255, 255);

          .icon{
            width: 20px;
            height: 20px;

            margin-right: 5px;
          }

          // 以下为各个文字组件的样式
          .position, .location, .company, .url, .blog, .email{
            font-family: DingTalk_JinBuTi_Regular;
            
            // 溢出隐藏
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .position{
            width: 30%;
            height: 100%;

            text-align: left;
          }

          .location{
            width: 50%;
            height: 100%;

            margin-left: 5px;
            text-align: left;
          }

          .company, .url, .blog, .email{
            width: 90%;
            height: 100%;

            text-align: left;
          }
        }
      }

      .bio_info{
        width: 95%;
        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        padding: 10px;
        margin: 20px;
        box-shadow: 2px 2px 6px #dcdcdc;
        border-radius: 5px;

        .bio{
          width: 100%;
          height: 100%;
          
          text-align: left;
          font-family: DingTalk_JinBuTi_Regular;
        }
      }

      // 单独的额外样式
      .company_info{
        margin-top: 30px;
      }

    }

    .rank_box{
      width: 100%;
      height: auto;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      margin-top: 180px;

      .base_box{
        width: 95%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        
        box-shadow: 2px 2px 6px #dcdcdc;
        border-radius: 10px;

        .rank_title{
          width: 100%;
          height: 10%;

          text-align: left;

          font-family: Hey-November-2;
          letter-spacing: 5px;
          font-size: 34px;
          padding-left: 50px;
          padding-top: 10px;
        }

        .radar_chart{
          width: 100%;
          height: 30%;

          padding-top: 0;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .bar_chart{
          width: 100%;
          height: 30%;

          padding-top: 0;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .line_chart{
          width: 100%;
          height: 30%;

          padding-top: 0;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>