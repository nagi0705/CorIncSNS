<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Cor.Inc SNS</h1>

    <!-- 🔹 SNS認証ボタン -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">SNSログイン</h2>
      <div class="flex space-x-2">
        <button @click="login('twitter')" class="bg-blue-400 text-white px-4 py-2 rounded">
          Twitter ログイン
        </button>
        <button @click="login('facebook')" class="bg-yellow-400 text-white px-4 py-2 rounded">
          Facebook ログイン
        </button>
        <button @click="login('instagram')" class="bg-pink-400 text-white px-4 py-2 rounded">
          Instagram ログイン
        </button>
      </div>
      <p v-if="user.name" class="text-green-600 mt-2">ログイン中: {{ user.name }}</p>
    </div>

    <!-- テキスト入力 -->
    <div class="mb-4">
      <label for="inputText" class="block text-lg">テキスト入力（最大140文字）</label>
      <textarea id="inputText" v-model="postText" class="w-full border p-2" placeholder="ここにテキストを入力してください"></textarea>
      <p class="text-sm text-gray-500">{{ postText.length }}/140 文字</p>
      <p v-if="isTextTooLong" class="text-red-500 text-sm mt-1">⚠️ 140文字以内で入力してください。</p>
    </div>

    <!-- 翻訳結果 -->
    <div class="mb-4">
      <label class="block text-lg">翻訳結果</label>
      <textarea v-model="translationResult" readonly class="w-full border p-2" placeholder="翻訳結果がここに表示されます"></textarea>
    </div>

    <!-- 画像・動画アップロード -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">画像/動画アップロード</h2>
      <FileUploader @upload-success="addFileUrlToPost" />
    </div>

    <!-- SNS 投稿ボタン -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">SNS 投稿</h2>
      <div class="space-y-2">
        <!-- Twitter 投稿ボタン -->
        <div class="flex space-x-2">
          <button @click="postToSNS('twitter', 'original')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Twitter（テキスト）
          </button>
          <button @click="postToSNS('twitter', 'translated')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Twitter（翻訳）
          </button>
          <button @click="postToSNS('twitter', 'both')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Twitter（両方）
          </button>
          <button @click="postToSNS('twitter', 'media')" class="bg-blue-400 text-white px-4 py-2 rounded"
            :disabled="!uploadedFileUrl">
            Twitter（画像/動画）
          </button>
        </div>

        <!-- Facebook 投稿ボタン -->
        <div class="flex space-x-2">
          <button @click="postToSNS('facebook', 'original')" class="bg-yellow-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Facebook（テキスト）
          </button>
          <button @click="postToSNS('facebook', 'translated')" class="bg-yellow-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Facebook（翻訳）
          </button>
          <button @click="postToSNS('facebook', 'both')" class="bg-yellow-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Facebook（両方）
          </button>
          <button @click="postToSNS('facebook', 'media')" class="bg-yellow-400 text-white px-4 py-2 rounded"
            :disabled="!uploadedFileUrl">
            Facebook（画像/動画）
          </button>
        </div>

        <!-- Instagram 投稿ボタン -->
        <div class="flex space-x-2">
          <button @click="postToSNS('instagram', 'original')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Instagram（テキスト）
          </button>
          <button @click="postToSNS('instagram', 'translated')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Instagram（翻訳）
          </button>
          <button @click="postToSNS('instagram', 'both')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="isTextTooLong">
            Instagram（両方）
          </button>
          <button @click="postToSNS('instagram', 'media')" class="bg-pink-400 text-white px-4 py-2 rounded"
            :disabled="!uploadedFileUrl">
            Instagram（画像/動画）
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 通知表示 -->
    <Notification v-if="notification.message" :message="notification.message" :type="notification.type" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FileUploader from '@/components/FileUploader.vue';
import Notification from '@/components/Notification.vue';
import debounce from 'lodash.debounce';

export default Vue.extend({
  name: 'IndexPage',
  components: { FileUploader, Notification },
  data() {
    return {
      postText: '',
      translationResult: '',
      notification: { message: '', type: 'success' },
      uploadedFileUrl: "",
      debouncedTranslate: null as unknown as (text: string) => void, // 🔥 翻訳用のデバウンス関数
      user: { name: '' }
    };
  },
  computed: {
    isTextTooLong() {
      return this.postText.length > 140;
    },
  },
  methods: {
    async login(platform: string) {
      try {
        const response = await this.$axios.$get(`/api/auth/${platform}`);

        // 🔥 ユーザー名と認証トークンを保存
        this.user.name = response.user.name;
        sessionStorage.setItem('accessToken', response.accessToken); // 🔥 トークンを保存！

        this.notification = { message: `${platform.toUpperCase()} ログイン成功`, type: 'success' };
      } catch (error) {
        console.error(`${platform} ログイン失敗:`, error);
        this.notification = { message: `${platform.toUpperCase()} ログイン失敗`, type: 'error' };
      }
    },

    async postToSNS(platform: string, type: string) {
      if (this.isTextTooLong) {
        this.notification = { message: '140文字以内で入力してください。', type: 'error' };
        return;
      }

      let textToPost = this.postText;
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        this.notification = { message: 'ログインが必要です', type: 'error' };
        return;
      }

      try {
        const response = await this.$axios.$post(`/api/post-to-${platform}`,
          { text: textToPost },
          { headers: { Authorization: `Bearer ${accessToken}` } } // 🔥 認証トークンを送信！
        );

        this.notification = { message: `${platform.toUpperCase()} 投稿成功: ${response.message}`, type: 'success' };
      } catch (error) {
        console.error(error);
        this.notification = { message: `${platform.toUpperCase()} 投稿失敗`, type: 'error' };
      }
    },

    async translateText(text: string): Promise<void> {
      try {
        const response = await this.$axios.$post('/api/translate', { 
          text,
          targetLang: 'en'  // 翻訳先言語を指定
        });
        this.translationResult = response.translatedText;
      } catch (error) {
        console.error('翻訳エラー:', error);
        this.notification = { message: '翻訳に失敗しました', type: 'error' };
      }
    },

    addFileUrlToPost(url: string): void {
      this.uploadedFileUrl = url;
      this.notification = { message: 'ファイルのアップロードが完了しました', type: 'success' };
    },
  },
  created() {
    this.debouncedTranslate = debounce(this.translateText, 500);
  },
});
</script>