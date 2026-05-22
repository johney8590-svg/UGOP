<template>
  <div class="min-h-screen bg-gray-900 text-white font-sans">
    <!-- 頂部導覽列：切換前后台 -->
    <header class="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-3">
        <span class="text-xl font-bold text-emerald-400">飲料連鎖營運監控系統</span>
        <span class="bg-gray-700 text-xs px-2 py-1 rounded">v1.0 Live</span>
      </div>
      <div class="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
        <button @click="currentView = 'front'" :class="['px-4 py-2 rounded-md transition', currentView === 'front' ? 'bg-emerald-500 text-black font-semibold' : 'text-gray-400']">
          前台儀表板
        </button>
        <button @click="currentView = 'back'" :class="['px-4 py-2 rounded-md transition', currentView === 'back' ? 'bg-emerald-500 text-black font-semibold' : 'text-gray-400']">
          後台參數修正
        </button>
      </div>
    </header>

    <!-- 前台儀表板視圖 -->
    <main v-if="currentView === 'front'" class="p-6 space-y-6">
      <!-- 店平均三劍客數據卡 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 relative overflow-hidden">
          <p class="text-gray-400 text-sm font-medium">店平均日營收 (PSD)</p>
          <p :class="['text-3xl font-black mt-2', store.healthStatus.isPsdAlert ? 'text-red-400' : 'text-emerald-400']">
            ${{ store.psd.toLocaleString() }}
          </p>
          <p class="text-xs text-gray-500 mt-1">損益兩平基準：${{ store.config.breakEvenPSD.toLocaleString() }}</p>
          <div v-if="store.healthStatus.isPsdAlert" class="absolute top-0 right-0 bg-red-500 text-black font-bold text-xs px-2 py-1 rounded-bl">營收破底告警</div>
        </div>
        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p class="text-gray-400 text-sm font-medium">店平均日來客 (PS_TC)</p>
          <p class="text-3xl font-black text-blue-400 mt-2">{{ store.psTC }} 單</p>
          <p class="text-xs text-gray-500 mt-1">單店日均交易筆數</p>
        </div>
        <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p class="text-gray-400 text-sm font-medium">店平均日杯數 (PS_Cup)</p>
          <p class="text-3xl font-black text-amber-400 mt-2">{{ store.psCups }} 杯</p>
          <p class="text-xs text-gray-500 mt-1">單店日均物料消耗體量</p>
        </div>
      </div>

      <!-- 外送平台三維度佔比分析 -->
      <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 class="text-lg font-bold mb-4 text-gray-200">外送通路三維度結構監控</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div class="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <span class="text-sm text-gray-400">外送金額占比</span>
            <div class="text-2xl font-bold mt-2 text-purple-400">{{ store.deliveryPercentages.amountPct }}%</div>
          </div>
          <div class="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <span class="text-sm text-gray-400">外送單數占比</span>
            <div class="text-2xl font-bold mt-2 text-purple-400">{{ store.deliveryPercentages.orderPct }}%</div>
          </div>
          <div class="bg-gray-900 p-4 rounded-lg border border-gray-800 relative">
            <span class="text-sm text-gray-400">外送杯數占比</span>
            <div class="text-2xl font-bold mt-2 text-purple-400">{{ store.deliveryPercentages.cupPct }}%</div>
            <div v-if="store.healthStatus.isDeliveryFat" class="text-xs text-red-400 mt-1">⚠️ 促銷過深，杯數增幅大於金額！</div>
          </div>
        </div>
      </div>
    </main>

    <!-- 後台參數/數據修正視圖 -->
    <main v-else class="p-6 max-w-3xl mx-auto space-y-8">
      <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 class="text-xl font-bold text-emerald-400 mb-6 border-b border-gray-700 pb-2">總部營運核心參數修正</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">現行營運總店數</label>
            <input type="number" v-model.number="store.config.totalStores" class="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-emerald-300 focus:outline-none focus:border-emerald-400">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">單店日均損益兩平點 (Break-Even PSD)</label>
            <input type="number" v-model.number="store.config.breakEvenPSD" class="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-emerald-300 focus:outline-none focus:border-emerald-400">
          </div>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 class="text-xl font-bold text-blue-400 mb-6 border-b border-gray-700 pb-2">營運總數據輸入 (可由 POS/報表定期更新)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">品牌全通路總 GMV</label>
            <input type="number" v-model.number="store.rawTotalData.totalGMV" class="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-blue-300 focus:outline-none">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">外送平台總 GMV</label>
            <input type="number" v-model.number="store.rawTotalData.deliveryGMV" class="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-purple-300 focus:outline-none">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">品牌總來客數 (單數)</label>
            <input type="number" v-model.number="store.rawTotalData.totalTC" class="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-blue-300 focus:outline-none">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">外送平台總單數</label>
            <input type="number" v-model.number="store.rawTotalData.deliveryOrders" class="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-purple-300 focus:outline-none">
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-4">＊提示：此處修改之參數將即時重算前台所有店平均數據，並即時觸發告警機制。</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDashboardStore } from './store/dashboard';

const currentView = ref('front'); // 'front' = 前台儀表板, 'back' = 後台參數
const store = useDashboardStore();
</script>
