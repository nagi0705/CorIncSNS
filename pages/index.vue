<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Cor.Inc SNS</h1>

    <!-- テキスト入力 -->
    <div class="mb-4">
      <label for="inputText" class="block text-lg">テキスト入力（最大140文字）</label>
      <textarea id="inputText" v-model="postText" class="w-full border p-2" placeholder="ここにテキストを入力してください"></textarea>

      <!-- 文字数カウント -->
      <p class="text-sm text-gray-500"> {{ postText.length }}/140 文字 </p>

      <!-- エラーメッセージ表示 -->
      <p v-if="isTextTooLong" class="text-red-500 text-sm mt-1">⚠️ 140文字以内で入力してください。</p>
    </div>

    <!-- 翻訳セクション -->
    <div class="mb-4">
      <button @click="translateText" class="bg-blue-500 text-white px-4 py-2 rounded" :disabled="isTextTooLong">
        翻訳する
      </button>
      <div class="mt-2">
        <label class="block text-lg">翻訳結果</label>
        <textarea v-model="translationResult" readonly class="w-full border p-2"
          placeholder="翻訳結果がここに表示されます"></textarea>
      </div>
    </div>

    <!-- 画像・動画アップロード -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">画像/動画アップロード</h2>
      <FileUploader />
    </div>

    <!-- SNS 投稿ボタン -->
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">SNS 投稿</h2>
      <div class="flex space-x-2">
        <button @click="postToSNS('twitter')" class="bg-blue-400 text-white px-4 py-2 rounded"
          :disabled="isTextTooLong">
          Twitter
        </button>
        <button @click="postToSNS('mixi')" class="bg-orange-500 text-white px-4 py-2 rounded" :disabled="isTextTooLong">
          mixi2
        </button>
        <button @click="postToSNS('linkedin')" class="bg-blue-600 text-white px-4 py-2 rounded"
          :disabled="isTextTooLong">
          LinkedIn
        </button>
        <button @click="postToSNS('facebook')" class="bg-blue-700 text-white px-4 py-2 rounded"
          :disabled="isTextTooLong">
          Facebook
        </button>
      </div>
    </div>

    <!-- 通知表示 -->
    <Notification v-if="notification.message" :message="notification.message" :type="notification.type" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FileUploader from '@/components/FileUploader.vue';
import Notification from '@/components/Notification.vue';

export default Vue.extend({
  name: 'IndexPage',
  components: { FileUploader, Notification },
  data() {
    return {
      postText: '',  // 入力されたテキスト
      translationResult: '',
      notification: { message: '', type: 'success' }
    };
  },
  computed: {
    isTextTooLong() {
      return this.postText.length > 140;  // 140文字超えたら true
    }
  },
  methods: {
    async translateText() {
      if (this.isTextTooLong) {
        this.notification = { message: "140文字以内で入力してください。", type: 'error' };
        return;
      }

      try {
        const result = await this.$translate(this.postText, 'en'); // 日本語 → 英語翻訳
        this.translationResult = result;
        this.notification = { message: "翻訳成功", type: 'success' };
      } catch (error) {
        console.error('翻訳エラー:', error);
        this.notification = { message: "翻訳失敗", type: 'error' };
      }
    },
    async postToSNS(platform: string) {
      if (this.isTextTooLong) {
        this.notification = { message: "140文字以内で入力してください。", type: 'error' };
        return;
      }

      try {
        const response = await this.$axios.$post(`/api/post-to-${platform}`, { text: this.postText });
        this.notification = { message: `${platform.toUpperCase()} 投稿成功: ${response.message}`, type: 'success' };
      } catch (error) {
        console.error(error);
        this.notification = { message: `${platform.toUpperCase()} 投稿失敗`, type: 'error' };
      }
    }
  }
});
</script>