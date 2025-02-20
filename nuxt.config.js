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

  // プラグイン設定
  plugins: [
    '~/plugins/translate.ts'
  ],

  // 自動コンポーネント読み込み
  components: true,

  // 開発・ビルド用モジュール（Nuxt 2 では buildModules を使用）
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss'
  ],

  // 通常のモジュール設定
  modules: [
    '@nuxtjs/axios'
  ],

  // サーバーミドルウェアの登録
  serverMiddleware: [
    '~/server-middleware/twitter.js',
    '~/server-middleware/sns.js',
    '~/server-middleware/translate.js'
  ],

  // ビルド設定
   build: {
    transpile: [
      'google-translate-api-x'
    ]
  }
}