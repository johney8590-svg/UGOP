import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './' // 👈 這行是關鍵！確保網頁是用「相對路徑」去抓檔案，才不會白畫面
})
