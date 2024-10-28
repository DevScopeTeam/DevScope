<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import TitleLogo from './components/TitleLogo.vue'
</script>

<template>
  <div class="outer_box">
    <TitleLogo class="title"/>
  </div>
  

  <!-- <RouterView /> -->
</template>

<style lang="scss" scoped>
.outer_box{
  width: 100%;
  height: 100%;

  // 子元素垂直水平居中
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title{
    width: 100%;
    height: 100%;

    // 居中
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    font-family: TsangerYuYangT_W05_W05;
    font-size: 60px;
    color: rgb(85, 158, 237);
    font-style: italic;
    letter-spacing: 3px;
  }
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
