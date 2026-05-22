import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './' // 這行極度重要，確保導出網頁後的檔案路徑正確
})
