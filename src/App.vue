<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute() // 使用路由

// 是否显示status bar
const isHome = computed(() => {
  let res = null
  if (route.path === '/home') { // 首页不显示
    res = false
  } else { // 其余显示
    res = true
  }
  return res
})

</script>

<template>
  <div>
    <!--顶部状态栏-->
    <div class="status_bar" v-show="isHome">
      
    </div>

    <!--路由-->
    <div :class="isHome ? 'router_view' : 'router_view_home'">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.status_bar{
  width: 100%;
  height: 54px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 99999; // 置于最顶层

  background: #e1e1e1;
}

.router_view{
  width: 100%;
  height: calc(100% - 54px);

  position: absolute;
  top: 54px;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.router_view_home{
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0px;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}




// header {
//   line-height: 1.5;
//   max-height: 100vh;
// }

// .logo {
//   display: block;
//   margin: 0 auto 2rem;
// }

// nav {
//   width: 100%;
//   font-size: 12px;
//   text-align: center;
//   margin-top: 2rem;
// }

// nav a.router-link-exact-active {
//   color: var(--color-text);
// }

// nav a.router-link-exact-active:hover {
//   background-color: transparent;
// }

// nav a {
//   display: inline-block;
//   padding: 0 1rem;
//   border-left: 1px solid var(--color-border);
// }

// nav a:first-of-type {
//   border: 0;
// }

// @media (min-width: 1024px) {
//   header {
//     display: flex;
//     place-items: center;
//     padding-right: calc(var(--section-gap) / 2);
//   }

//   .logo {
//     margin: 0 2rem 0 0;
//   }

//   header .wrapper {
//     display: flex;
//     place-items: flex-start;
//     flex-wrap: wrap;
//   }

//   nav {
//     text-align: left;
//     margin-left: -1rem;
//     font-size: 1rem;

//     padding: 1rem 0;
//     margin-top: 1rem;
//   }
// }
</style>
