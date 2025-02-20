// types/nuxt.d.ts
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $translate(text: string, targetLang: string): Promise<string>
    $axios: any  // ✅ `$axios` の型を定義
  }
}