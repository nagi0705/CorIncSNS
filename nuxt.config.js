export default {
  // サーバーサイドレンダリングの無効化（SPA モード）
  ssr: false,

  // グローバルなページヘッダー設定
  head: {
    title: 'corincsns',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // グローバルなCSS（必要に応じて追加）
  css: [
  ],

  // プラグイン設定（必要に応じて追加）
  plugins: [
  ],

  // 自動コンポーネント読み込み
  components: true,

  // 開発・ビルド用モジュール（Nuxt 2 では buildModules を使用）
  buildModules: [
    // TypeScript サポート
    '@nuxt/typescript-build',
    // Tailwind CSS モジュール（Nuxt 2 用）
    '@nuxtjs/tailwindcss'
  ],

  // 通常のモジュール設定（必要に応じて追加）
  modules: [
  ],

  // ビルド設定
  build: {
  }
}