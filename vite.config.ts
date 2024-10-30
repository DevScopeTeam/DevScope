import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  // ,
  // css: {
  //   preprocessorOptions: { // css预处理器
  //     scss: { 
  //       additionalData: '@import "@/assets/style/shared.scss";' // 引入使得在全局使用shared.scss的共享样式
  //     }
  //   }
  // }
})
