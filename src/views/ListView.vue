<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ElSkeleton, ElSkeletonItem } from 'element-plus'
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

const route = useRoute() // 使用路由

/* 使用pinia的数据，实现父子组件通信 */
const userStore = useUserStore()
const searchStore = useSearchStore()

const state = reactive({
  isLoading: true, // 是否加载中
  top3List: [] as string[] // 存放top3的排名图标
})

// define object class
class userInfoClass {
	id = 0
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

// define type of object
interface UserItem {
  id: number,
  avatar_url: string,
  name: string,
  login: string,
  position: string,
  location: string,
  company: string,
  url: string,
  blog: string,
  email: string,
  bio: string
};

// define userinfo object
let curUser = reactive<UserItem>(new userInfoClass())
let userList = reactive<UserItem[]>(new Array())

const allocateMember = (input: UserItem) => {
  let user = reactive<UserItem>(new userInfoClass())
  // user.id = (JSON.parse(input)).id
  // user.avatar_url = (JSON.parse(input)).avatar_url
  // user.bio = (JSON.parse(input)).bio
  // user.blog = (JSON.parse(input)).blog
  // user.company = (JSON.parse(input)).company
  // user.email = (JSON.parse(input)).email
  // user.location = (JSON.parse(input)).location
  // user.login = (JSON.parse(input)).login
  // user.position = (JSON.parse(input)).position
  // user.url = (JSON.parse(input)).url
  // user.name = (JSON.parse(input)).name
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

onBeforeMount(() => {
  // 构造用户信息
  let tmp = userStore.getUserList()  // string array
  for(let i=0;i<tmp.length;i++){
    let user = allocateMember(JSON.parse(tmp[i]))
    userList.push(user)
  }
  console.log('userList', userList)
  curUser = userList[0]

  state.isLoading = false // 测试
  console.log('loading', state.isLoading)

  // 构造top3
  state.top3List.push(top1, top2, top3)
})

const selectUser = (user: UserItem) => {
  // 指定所选元素
  curUser = allocateMember(user)
  console.log('curUser', curUser)
}

</script>

<template>
  <div class="outer_box">
    <!-- 列表(按领域搜索时显示) -->
    <div class="list_box" v-show="searchStore.getSearchMode()">
    <!-- <div class="list_box"> -->
      <div class="list_title">
        TalentRank
      </div>
      <div class="list_content" v-for="(item, index) in userList" :key="index" :label="item" :value="item" @click="selectUser(item)">
        <!--排名图标（top 3）-->
        <img class="image" v-if="index<3" :src="state.top3List[index]" alt=""/>
        <!--排名数字（others）-->
        <div class="number" v-else>{{ index + 1 }}</div>
        <div class="username">{{ item.name }}</div>
        <img class="image" :src="item.avatar_url" alt=""/>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="body_box">
      <div v-if="state.isLoading === false">
        <!-- info -->
        <div class="info_box">
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
              <el-tooltip :content="curUser.position" placement="bottom" effect="light">
                <div class="position">{{ curUser.position }}</div>
              </el-tooltip>
              <el-tooltip :content="curUser.location" placement="bottom" effect="light">
                <div class="location">{{ curUser.location }}</div>
              </el-tooltip>
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
          1
        </div>
      </div>

      <!-- skeleton -->
      <div v-else>
        <el-skeleton class="skeleton_box" animated>
          <template slot="template">
            <div class="base_info">
              <div class="amatar_box">
                <el-skeleton-item variant="image" style="width: 80%;height: 80%;" class="avatar"/>
              </div>
              <div class="name_box">
                <el-skeleton-item variant="text" class="name" />
                <el-skeleton-item variant="text" class="login" />
              </div>
            </div>

            <div class="company_info">
              <div class="group_box">
                <el-skeleton-item variant="image" class="icon"/>
                <el-skeleton-item variant="text" class="position" />
                <el-skeleton-item variant="text" class="location" />
              </div>
              <div class="group_box">
                <el-skeleton-item variant="image" class="icon"/>
                <el-skeleton-item variant="text" class="company" />
              </div>
            </div>

            <div class="link_info">
              <div class="group_box">
                <el-skeleton-item variant="image" class="icon"/>
                <el-skeleton-item variant="text" class="url" />
              </div>
              <div class="group_box">
                <el-skeleton-item variant="image" class="icon"/>
                <el-skeleton-item variant="text" class="blog" />
              </div>
            </div>

            <div class="email_info">
              <div class="group_box">
                <el-skeleton-item variant="text" class="email" />
              </div>
            </div>

            <div class="bio_info">
              <el-skeleton-item variant="text" class="bio" />
            </div>
          </template>
        </el-skeleton>
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
    height: auto;

    padding: 10px;
    border-radius: 10px;
    box-shadow: 3px 3px 8px #dcdcdc;
    background-color: rgb(247, 250, 252);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin-right: 10px;

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
    }

    .list_content{
      width: 100%;
      height: 45px;

      // background-image: url('@/assets/image/list_title_blue.png');
      // background-repeat: no-repeat;
      // background-size: 100% 100%;
      border-radius: 0 0 6px 6px;
      box-shadow: 1px 2px #dcdcdc;
      background-color: rgb(255, 255, 255);
      cursor: pointer;

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

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
        width: 65%;
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
        height: 90%;

        padding: 5px;
        margin-right: 5px;
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
          }

          .login{
            width: 100%;
            height: auto;

            text-align: left;
            padding-left: 20px;
            font-size: 20px;
            letter-spacing: 1px;
            font-family: TsangerYuYangT_W02_W02;
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

        margin-left: 10px;
      }

      .company_info, .link_info, .email_info{
        width: 100%;
        height: 100%;

        padding: 10px;

        .group_box{
          width: 48%;
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
    }

    .skeleton_box{
      width: 90%;
      height: auto;

      display: flex;
      flex-direction: column;
      justify-content: center;

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
          }

          .login{
            width: 100%;
            height: auto;

            text-align: left;
            padding-left: 20px;
            font-size: 20px;
            letter-spacing: 1px;
            font-family: TsangerYuYangT_W02_W02;
          }
        }
      }

      .company_info, .link_info{
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;

        padding: 10px;

        .group_box{
          width: 50%;
          height: 100%;

          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .icon{
            width: 20px;
            height: 20px;

            margin-right: 5px;
          }

          // 以下为各个文字组件的样式
          .position, .location, .company, .url, .blog{
            font-family: DingTalk_JinBuTi_Regular;
          }

          .position{
            width: 30%;
            height: auto;

            text-align: left;
          }

          .location{
            width: 50%;
            height: auto;

            margin-left: 5px;
            text-align: left;
          }

          .company, .url, .blog{
            width: 90%;
            height: auto;

            text-align: left;
          }
        }
      }

      .email_info, .bio_info{
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        padding: 10px;

        .group_box{
          width: 50%;
          height: 100%;

          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .email{
            width: 48%;
            height: 100%;
            
            text-align: left;
            font-family: DingTalk_JinBuTi_Regular;
            background-color: red;
          }
        }

        // 以下为各个文字组件的样式
        .bio{
          width: 48%;
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
  }
}
</style>