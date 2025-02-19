// types/nuxt.d.ts
import Vue from 'vue'

// Vueインスタンスに $translate を追加するための宣言
declare module 'vue/types/vue' {
  interface Vue {
    $translate(text: string, targetLang: string): Promise<string>
  }
}