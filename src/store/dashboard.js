import { defineStore } from 'pinia';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    // 後台可修正的系統核心參數
    config: {
      totalStores: 25,       // 總店數
      operatingDays: 30,     // 統計天數
      breakEvenPSD: 22000,   // 單店損益兩平點
      platformCommission: 0.35 // 外送平台抽成率
    },
    // 門市原始總數據
    rawTotalData: {
      totalGMV: 18750000,    // 總營收 (包含外送)
      totalTC: 262500,       // 總來客數
      totalCups: 375000,     // 總杯數
      deliveryGMV: 6562500,  // 外送總金額
      deliveryOrders: 78750, // 外送總單數
      deliveryCups: 112500   // 外送總杯數
    }
  }),
  getters: {
    // 關鍵「店平均」概念指標計算
    psd() { // 店平均日營收
      return Math.round(this.rawTotalData.totalGMV / (this.config.totalStores * this.config.operatingDays));
    },
    psTC() { // 店平均日來客
      return Math.round(this.rawTotalData.totalTC / (this.config.totalStores * this.config.operatingDays));
    },
    psCups() { // 店平均日杯數
      return Math.round(this.rawTotalData.totalCups / (this.config.totalStores * this.config.operatingDays));
    },
    // 外送平台三維度占比
    deliveryPercentages() {
      return {
        amountPct: ((this.rawTotalData.deliveryGMV / this.rawTotalData.totalGMV) * 100).toFixed(1),
        orderPct: ((this.rawTotalData.deliveryOrders / this.rawTotalData.totalTC) * 100).toFixed(1),
        cupPct: ((this.rawTotalData.deliveryCups / this.rawTotalData.totalCups) * 100).toFixed(1)
      };
    },
    // 異常警報診斷
    healthStatus() {
      return {
        isPsdAlert: this.psd < this.config.breakEvenPSD,
        isDeliveryFat: parseFloat(((this.rawTotalData.deliveryCups / this.rawTotalData.totalCups) * 100).toFixed(1)) > parseFloat(((this.rawTotalData.deliveryGMV / this.rawTotalData.totalGMV) * 100).toFixed(1))
      };
    }
  }
});
